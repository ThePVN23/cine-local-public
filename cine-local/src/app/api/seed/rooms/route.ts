import { NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import Room from "../../../models/Room";

export async function GET() {
  await connectMongoDB();

  const rooms = [
    { building: "MLC", roomNumber: "101", maxOccupancy: 4 },
    { building: "MLC", roomNumber: "102", maxOccupancy: 6 },
    { building: "MLC", roomNumber: "348", maxOccupancy: 30 },
    { building: "Boyd", roomNumber: "204", maxOccupancy: 8 },
    { building: "Main Library", roomNumber: "Study Pod A", maxOccupancy: 2 },
    { building: "Brumby Hall", roomNumber: "Main Lounge", maxOccupancy: 50 },
    { building: "Russell Hall", roomNumber: "Floor 1 Lounge", maxOccupancy: 20 },
    { building: "Creswell Hall", roomNumber: "Lobby", maxOccupancy: 35 }
  ];

  await Room.deleteMany({}); 
  await Room.insertMany(rooms);

  return NextResponse.json({ success: true, message: "Rooms seeded" });
}