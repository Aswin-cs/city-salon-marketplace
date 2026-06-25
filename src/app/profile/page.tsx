import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Mail, Shield, Calendar } from "lucide-react";
import dbConnect from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Salon } from "@/models/Salon";
import { ProfileBookingsClient } from "@/components/ProfileBookingsClient";

async function getUserBookings(email: string) {
  await dbConnect();
  // Fetch bookings and populate the salon details (name, address)
  const bookings = await Booking.find({ customerEmail: email })
    .populate('salonId', 'name address')
    .sort({ appointmentTime: -1 });
    
  return JSON.parse(JSON.stringify(bookings));
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const bookings = await getUserBookings(session.user.email as string);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 hover:bg-rose-100/50 text-emerald-900 px-4 py-2 transition-colors rounded-full border border-rose-200 hover:border-rose-300 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-emerald-950 mb-10">
          My Profile
        </h2>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-rose-50 mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 bg-emerald-900 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-3xl font-medium text-emerald-950">{session.user.name || "Guest"}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-emerald-800/70 font-medium text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {session.user.email}
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-rose-200"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role: <span className="capitalize">{((session.user as any)?.role) || 'User'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING HISTORY */}
        <div>
          <h3 className="text-2xl font-medium tracking-tight text-emerald-950 mb-6 flex items-center gap-4">
            <span>Booking History</span>
            <div className="h-px bg-rose-200 flex-1"></div>
          </h3>

          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-rose-50">
              <Calendar className="w-12 h-12 text-rose-200 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-emerald-950 mb-2">No bookings yet</h4>
              <p className="text-emerald-800/60 mb-6 max-w-sm mx-auto">You haven't made any salon appointments. Browse our marketplace to find premium grooming services.</p>
              <Link href="/" className="inline-block px-6 py-3 bg-emerald-900 text-white rounded-full font-medium hover:bg-emerald-800 transition-colors shadow-sm">
                Explore Salons
              </Link>
            </div>
          ) : (
            <ProfileBookingsClient initialBookings={bookings} />
          )}
        </div>
      </div>
    </main>
  );
}
