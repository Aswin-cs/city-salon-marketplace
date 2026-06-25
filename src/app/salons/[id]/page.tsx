import Link from "next/link";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Salon } from "@/models/Salon";
import { ServiceMenuClient } from "@/components/ServiceMenuClient";

// Enforce instant static shell validation at dev and build time
export const unstable_instant = { prefetch: "static" };

// Helper to fetch salon data safely on the server
async function getSalon(id: string) {
  await dbConnect();
  try {
    const salon = await Salon.findById(id);
    if (!salon) return null;
    return JSON.parse(JSON.stringify(salon));
  } catch (error) {
    console.error("Failed to fetch salon:", error);
    return null;
  }
}

// Cached database lookup
async function getSalonCached(id: string) {
  "use cache";
  cacheLife("minutes");
  return getSalon(id);
}

export default function SalonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const sessionPromise = getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 hover:bg-rose-100/50 text-emerald-900 px-4 py-2 transition-colors rounded-full border border-rose-200 hover:border-rose-300 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>

      <Suspense fallback={<SalonProfileSkeleton />}>
        {params.then(({ id }) => (
          <SalonProfileContent id={id} sessionPromise={sessionPromise} />
        ))}
      </Suspense>
    </main>
  );
}

async function SalonProfileContent({ id, sessionPromise }: { id: string; sessionPromise: Promise<any> }) {
  const salonData = await getSalonCached(id);
  const session = await sessionPromise;

  if (!salonData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-emerald-950 mb-4">Salon Not Found</h2>
        <Link href="/" className="px-6 py-2 bg-emerald-900 text-white rounded-full text-sm font-semibold">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 gap-12 mt-8">
      {/* LEFT COLUMN: EDITORIAL PROFILE */}
      <div className="lg:w-1/2 flex flex-col">
        <div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-emerald-950 leading-[1.1] mb-6">
            {salonData.name}
          </h1>
          
          <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-xl bg-rose-50">
            <img 
              src={salonData.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200&h=800"} 
              alt={salonData.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-lg text-emerald-900/80 leading-relaxed mb-10 max-w-lg font-light">
            {salonData.description}
          </p>
        </div>

        <div className="space-y-6 pt-8 border-t border-rose-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-rose-100/50 rounded-full text-rose-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-1">LOCATION</p>
              <p className="font-medium text-emerald-950">{salonData.address}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-rose-100/50 rounded-full text-rose-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-1">HOURS</p>
              <p className="font-medium text-emerald-950">{salonData.hours || "10:00 AM - 08:00 PM (Tues-Sun)"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SERVICE MENU */}
      <div className="lg:w-1/2">
        <h2 className="text-3xl font-medium tracking-tight text-emerald-950 mb-8 pb-4 border-b border-rose-200">
          Service Menu
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="font-semibold text-sm tracking-widest text-emerald-900 mb-6 flex items-center gap-4">
              <span>ALL SERVICES</span>
              <div className="h-px bg-rose-200 flex-1"></div>
            </h3>
            
            <ServiceMenuClient 
              salonId={id} 
              services={salonData.services} 
              session={session} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SalonProfileSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 gap-12 mt-8 animate-pulse">
      {/* LEFT COLUMN: EDITORIAL PROFILE SKELETON */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="h-14 w-3/4 bg-rose-100/50 rounded mb-6" />
        <div className="aspect-[4/3] rounded-3xl bg-rose-100/50 mb-8" />
        <div className="h-4 w-full bg-rose-100/50 rounded mb-3" />
        <div className="h-4 w-5/6 bg-rose-100/50 rounded mb-3" />
        <div className="h-4 w-2/3 bg-rose-100/50 rounded mb-10" />

        <div className="space-y-6 pt-8 border-t border-rose-200">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-100/50" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-rose-100/50 rounded" />
              <div className="h-4 w-3/4 bg-rose-100/50 rounded" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-100/50" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-rose-100/50 rounded" />
              <div className="h-4 w-1/2 bg-rose-100/50 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SERVICE MENU SKELETON */}
      <div className="lg:w-1/2">
        <div className="h-9 w-40 bg-rose-100/50 rounded mb-8" />
        <div className="h-4 w-full bg-rose-100/50 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-rose-50 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-rose-100/50 rounded" />
                <div className="h-3.5 w-16 bg-rose-100/50 rounded" />
              </div>
              <div className="flex items-center gap-6">
                <div className="h-6 w-16 bg-rose-100/50 rounded" />
                <div className="h-9 w-20 bg-rose-100/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
