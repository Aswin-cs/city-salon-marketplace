import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Salon } from "@/models/Salon";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const zone = searchParams.get("zone");
    const serviceType = searchParams.get("serviceType");

    const query: any = {};

    if (zone) {
      query.neighborhood = { $regex: new RegExp(zone, "i") };
    }

    if (serviceType) {
      query["services.name"] = { $regex: new RegExp(serviceType, "i") };
    }

    const salons = await Salon.find(query).sort({ overallRating: -1 });

    return NextResponse.json({ success: true, data: salons }, { status: 200 });
  } catch (error) {
    console.error("Error fetching salons:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch salons." },
      { status: 500 }
    );
  }
}
