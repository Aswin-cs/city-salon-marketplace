import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Salon } from "@/models/Salon";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const salon = await Salon.findById(id);

    if (!salon) {
      return NextResponse.json(
        { success: false, error: "Salon not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: salon }, { status: 200 });
  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch salon." },
      { status: 500 }
    );
  }
}
