import { NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import WatchlistMovie from "../../models/WatchlistMovie";

export async function GET() {
  await connectMongoDB();
  
  try {
    await WatchlistMovie.collection.dropIndexes();
    return NextResponse.json({ message: "Indexes dropped successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}