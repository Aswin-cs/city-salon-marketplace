import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Booking } from "@/models/Booking";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { salonId, customerName, customerEmail, selectedServices, appointmentTime } = body;

    // Basic Validation
    if (!salonId || !customerName || !customerEmail || !selectedServices || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    // Calculate total amount from selected services
    const totalAmount = selectedServices.reduce((sum: number, service: any) => sum + (service.price || 0), 0);

    const newBooking = new Booking({
      salonId,
      customerName,
      customerEmail,
      selectedServices,
      appointmentTime: new Date(appointmentTime),
      totalAmount,
      status: "pending"
    });

    const savedBooking = await newBooking.save();

    return NextResponse.json(
      { success: true, data: savedBooking },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking." },
      { status: 500 }
    );
  }
}
