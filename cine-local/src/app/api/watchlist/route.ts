import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import connectMongoDB from "../../../../config/mongodb";
import WatchlistMovie from "../../models/WatchlistMovie";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  const userId = (session.user as any).id;
  const watchlist = await WatchlistMovie.find({ userId });

  return NextResponse.json({ watchlist });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const movieData = await request.json();
  const userId = (session.user as any).id;

  if (!userId) {
    return NextResponse.json({ error: "Session invalid" }, { status: 400 });
  }

  await connectMongoDB();

  const exists = await WatchlistMovie.findOne({
    userId,
    id: movieData.id,
  });

  if (exists) {
    return NextResponse.json({ message: "Already in watchlist" });
  }

  await WatchlistMovie.create({
    userId,
    ...movieData,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { movieId } = await request.json();
  const userId = (session.user as any).id;

  await connectMongoDB();

  await WatchlistMovie.findOneAndDelete({
    userId,
    id: movieId,
  });

  return NextResponse.json({ success: true });
}