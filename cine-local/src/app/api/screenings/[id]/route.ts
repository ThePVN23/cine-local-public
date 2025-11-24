import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import connectMongoDB from "@/config/mongodb";
import Screening from "../../../models/Screening";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await connectMongoDB();

  const screening = await Screening.findById(id);

  if (!screening) {
    return NextResponse.json({ error: "Screening not found" }, { status: 404 });
  }

  if (screening.host.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: "You are not authorized to delete this screening" }, { status: 403 });
  }

  await Screening.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}