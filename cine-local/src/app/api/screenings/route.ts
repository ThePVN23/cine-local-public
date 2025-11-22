import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import connectMongoDB from "@/config/mongodb";
import Room from "../../models/Room";
import Screening from "../../models/Screening";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, movieTitle, moviePoster, roomId, startTimeString } = await request.json();

  await connectMongoDB();

  const room = await Room.findById(roomId);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`);
  const movieData = await tmdbRes.json();
  const durationMinutes = movieData.runtime || 120; 

  const startTime = new Date(startTimeString);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  const conflict = await Screening.findOne({
    room: roomId,
    $and: [
      { startTime: { $lt: endTime } },
      { endTime: { $gt: startTime } }
    ]
  });

  if (conflict) {
    return NextResponse.json({ error: "Room is already booked for this time" }, { status: 409 });
  }

  const newScreening = await Screening.create({
    host: (session.user as any).id,
    movieId,
    movieTitle,
    moviePoster,
    room: roomId,
    startTime,
    endTime,
    attendees: [(session.user as any).id],
    maxAttendees: room.maxOccupancy
  });

  return NextResponse.json(newScreening);
}

export async function GET(request: Request) {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");
    const hostId = searchParams.get("hostId");
  
    let query: any = { startTime: { $gte: new Date() } };

    if (movieId) {
      query.movieId = movieId;
    }
    
    if (hostId) {
      query.host = hostId;
    }

    const screenings = await Screening.find(query)
      .populate("room")
      .populate("host", "username")
      .sort({ startTime: 1 });
      
    return NextResponse.json(screenings);
}