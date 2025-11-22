import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import connectMongoDB from "../../../../../config/mongodb";
import Screening from "../../../models/Screening";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { screeningId } = await request.json();
  await connectMongoDB();

  const screening = await Screening.findById(screeningId);

  if (!screening) return NextResponse.json({ error: "Screening not found" }, { status: 404 });

  if (screening.attendees.length >= screening.maxAttendees) {
    return NextResponse.json({ error: "Screening is full" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  if (!screening.attendees.includes(userId)) {
    screening.attendees.push(userId);
    await screening.save();
  }

  return NextResponse.json({ success: true });
}