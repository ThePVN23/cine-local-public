import { NextResponse } from 'next/server';
import Screening from '../../models/Screening';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostId, hostName, movieTitle, date, time, location, message } = body;

    if (!hostId || !movieTitle || !date || !location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const newScreening = await Screening.create({
      hostId,
      hostName,
      movieTitle,
      date,
      time,
      location,
      message,
      attendees: [hostId]
    });

    return NextResponse.json({ message: 'Screening created!', screening: newScreening }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const screenings = await Screening.find().sort({ createdAt: -1 });
    return NextResponse.json(screenings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
