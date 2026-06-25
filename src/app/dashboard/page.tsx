import Link from "next/link";
import { ArrowLeft, Users, TrendingUp, CalendarCheck, IndianRupee } from "lucide-react";
import dbConnect from "@/lib/db";
import { Booking } from "@/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Helper to fetch data safely
async function getDashboardData() {
  await dbConnect();
  // We can fetch bookings, for now let's just fetch all to mock manager view
  const bookings = await Booking.find({}).sort({ appointmentTime: -1 });
  const rawBookings = JSON.parse(JSON.stringify(bookings));
  
  const totalBookings = rawBookings.length;
  const revenue = rawBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
  const pendingActions = rawBookings.filter((b: any) => b.status === 'pending').length;
  
  const formattedAppointments = rawBookings.map((b: any) => {
    const d = new Date(b.appointmentTime);
    return {
      id: b._id.toString().slice(-8).toUpperCase(), // Use last 8 chars for unique Short ID
      fullId: b._id.toString(), // Keep full ID for React key just in case
      client: b.customerName,
      service: b.selectedServices?.[0]?.name || "Unknown Service",
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
      value: b.totalAmount || 0
    };
  });
  
  return {
    appointments: formattedAppointments,
    metrics: {
      totalBookings,
      liveTraffic: Math.floor(Math.random() * 500) + 500, // mock traffic
      revenue,
      pendingActions
    }
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Check if they are admin/manager
  if ((session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  const { appointments, metrics } = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 hover:bg-rose-100/50 text-emerald-900 px-4 py-2 transition-colors rounded-full border border-rose-200 hover:border-rose-300 text-sm font-medium w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
        <div className="font-medium text-sm text-emerald-800/60 bg-rose-100/50 border border-rose-200/50 px-4 py-1.5 rounded-full w-fit">
          THE ARCHIVE (ID: 1)
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-emerald-950 leading-none mb-3">Analytics</h2>
          <p className="text-base font-medium text-emerald-800/60">Live Metrics Overview</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 relative overflow-hidden group hover:shadow-md transition-all">
            <CalendarCheck className="w-16 h-16 absolute -bottom-4 -right-4 text-rose-50 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-2 relative z-10">TOTAL BOOKINGS</h3>
            <p className="text-4xl font-medium text-emerald-950 relative z-10">{metrics.totalBookings}</p>
            <p className="text-sm font-medium text-emerald-600 mt-3 relative z-10 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-4 h-4" /> +12% this week
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 relative overflow-hidden group hover:shadow-md transition-all">
            <Users className="w-16 h-16 absolute -bottom-4 -right-4 text-rose-50 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-2 relative z-10">LIVE TRAFFIC</h3>
            <p className="text-4xl font-medium text-emerald-950 relative z-10">{metrics.liveTraffic}</p>
            <p className="text-sm font-medium text-emerald-600 mt-3 relative z-10 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-4 h-4" /> +5% this week
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 relative overflow-hidden group hover:shadow-md transition-all">
            <IndianRupee className="w-16 h-16 absolute -bottom-4 -right-4 text-rose-50 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-2 relative z-10">REVENUE</h3>
            <p className="text-4xl font-medium text-emerald-950 relative z-10">₹{metrics.revenue.toLocaleString()}</p>
            <p className="text-sm font-medium text-emerald-600 mt-3 relative z-10 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp className="w-4 h-4" /> +18% this week
            </p>
          </div>

          <div className="bg-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-900/10">
            <h3 className="font-semibold text-xs tracking-widest text-emerald-100/70 mb-2">PENDING ACTIONS</h3>
            <p className="text-4xl font-medium text-white">{metrics.pendingActions}</p>
            <Link href="#" className="inline-block mt-5 text-sm font-medium text-rose-200 hover:text-white transition-colors flex items-center gap-2 w-fit">
              Review Now <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-rose-100">
            <h3 className="font-medium text-2xl text-emerald-950">Recent Appointments</h3>
            <button className="font-medium text-sm text-emerald-900 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-rose-100">
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">ID</th>
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">CLIENT</th>
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">SERVICE</th>
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">DATE & TIME</th>
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">VALUE</th>
                  <th className="py-4 px-6 font-semibold text-xs tracking-widest text-emerald-800/60">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any) => (
                  <tr key={apt.fullId} className="border-b border-rose-50 last:border-b-0 hover:bg-rose-50/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-sm text-emerald-800/60">{apt.id}</td>
                    <td className="py-4 px-6 font-medium text-emerald-950">{apt.client}</td>
                    <td className="py-4 px-6 font-medium text-sm text-emerald-900">{apt.service}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-emerald-950 text-sm">{apt.date}</div>
                      <div className="text-xs text-emerald-800/60 font-medium mt-0.5">{apt.time}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-emerald-950">₹{apt.value.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 font-medium text-xs rounded-full 
                        ${apt.status.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                          apt.status.toLowerCase() === 'confirmed' ? 'bg-rose-100 text-rose-800' : 
                          'bg-amber-100 text-amber-800'}
                      `}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
