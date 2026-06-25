import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Booking } from "@/models/Booking";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // In Next 15+ App Router, `params` is a Promise!
    const { id } = await props.params;

    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Verify ownership (or admin role)
    if (booking.customerEmail !== session.user.email && (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Update status
    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
