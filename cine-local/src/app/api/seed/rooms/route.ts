import { NextResponse } from "next/server";
// Go up 5 levels to reach root for config: rooms -> seed -> api -> app -> src -> ROOT
import connectMongoDB from "../../../../../config/mongodb";
// Go up 3 levels to reach models: rooms -> seed -> api -> app -> models
import Room from "../../../models/Room";

export async function GET() {
  try {
    await connectMongoDB();

    // Data parsed from First_Come_First_Serve.txt
    const rooms = [
      // Zell B. Miller Learning Center
      { building: "Zell B. Miller Learning Center", roomNumber: "201", maxOccupancy: 6 },

      // Shirley Mathis McBay Science Library
      { building: "Shirley Mathis McBay Science Library", roomNumber: "441A", maxOccupancy: 3 },

      // Main Library
      { building: "Main Library", roomNumber: "132", maxOccupancy: 4 },

      // Russell Hall
      { building: "Russell Hall", roomNumber: "Floor 1 TV Lounge", maxOccupancy: 10 },

      // Brumby Hall
      { building: "Brumby Hall", roomNumber: "Floor 1 TV Lounge", maxOccupancy: 10 },

      // Creswell Hall
      { building: "Creswell Hall", roomNumber: "Floor 1 TV Lounge", maxOccupancy: 10 },

      // Black-Diallo-Miller Hall
      { building: "Black-Diallo-Miller Hall", roomNumber: "Floor 1 TV Lounge", maxOccupancy: 10 },

      // Building 1516
      { building: "Building 1516", roomNumber: "Floor 1 TV Lounge", maxOccupancy: 10 },
    ];

    await Room.deleteMany({ building: { $ne: "Tate Student Center" } });
    await Room.insertMany(rooms);

    return NextResponse.json({ success: true, message: `Seeded ${rooms.length} rooms` });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}