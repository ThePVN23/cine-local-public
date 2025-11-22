import { NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import Room from "../../models/Room";

export async function GET() {
  try {
    await connectMongoDB();
    const rooms = await Room.find({}).sort({ building: 1, roomNumber: 1 });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}