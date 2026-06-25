import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Booking } from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in to book." }, { status: 401 });
    }

    const { salonId, selectedServices, appointmentTime, totalAmount } = await req.json();

    if (!salonId || !selectedServices || !appointmentTime || !totalAmount) {
      return NextResponse.json({ message: "Missing required booking details." }, { status: 400 });
    }

    await dbConnect();

    const booking = await Booking.create({
      salonId,
      customerName: session.user.name || "Guest",
      customerEmail: session.user.email,
      selectedServices,
      status: 'pending',
      appointmentTime,
      totalAmount
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
