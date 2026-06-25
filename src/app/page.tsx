import Link from "next/link";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { Search, MapPin, Star, MessageSquareText } from "lucide-react";
import dbConnect from "@/lib/db";
import { Salon } from "@/models/Salon";
import { SearchBar } from "@/components/SearchBar";

// Enforce instant static shell validation at dev and build time
export const unstable_instant = { prefetch: "static" };

// Helper to fetch data safely without hitting our own API endpoint during build
async function getSalons(filters: { service?: string; location?: string; search?: string }) {
  await dbConnect();
  let query: any = {};
  
  if (filters.service) {
    let regex = filters.service;
    if (filters.service === 'Hair') regex = 'Cut|Color|Styling|Keratin|Hair';
    if (filters.service === 'Nails') regex = 'Nail|Manicure|Gel';
    if (filters.service === 'Makeup') regex = 'Makeup';
    if (filters.service === 'Skincare') regex = 'Facial|Detox|Repair';
    query["services.name"] = { $regex: new RegExp(regex, 'i') };
  }

  if (filters.location) {
    let neighborhoods: string[] = [];
    if (filters.location === 'South Bombay') neighborhoods = ['Colaba', 'Lower Parel'];
    if (filters.location === 'Bandra - Juhu') neighborhoods = ['Bandra West', 'Juhu', 'Khar'];
    if (filters.location === 'Andheri - Goregaon') neighborhoods = ['Andheri West'];
    if (filters.location === 'Eastern Suburbs') neighborhoods = ['Powai', 'Chembur'];
    
    if (neighborhoods.length > 0) {
      query["neighborhood"] = { $in: neighborhoods };
    }
  }

  if (filters.search) {
    query["$or"] = [
      { name: { $regex: new RegExp(filters.search, 'i') } },
      { description: { $regex: new RegExp(filters.search, 'i') } },
      { "services.name": { $regex: new RegExp(filters.search, 'i') } },
      { neighborhood: { $regex: new RegExp(filters.search, 'i') } }
    ];
  }

  const salons = await Salon.find(query).sort({ overallRating: -1 });
  return JSON.parse(JSON.stringify(salons));
}

// Cached wrapper around database retrieval
async function getSalonsCached(filters: { service?: string; location?: string; search?: string }) {
  "use cache";
  cacheLife("minutes");
  return getSalons(filters);
}

export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  return (
    <main className="min-h-screen pb-24">

      {/* HERO SECTION */}
      <section className="px-6 py-16 md:py-24 lg:py-32 max-w-7xl mx-auto text-center md:text-left">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] text-emerald-950">
            Find your aesthetic sanctuary<span className="text-rose-400 italic">.</span>
          </h2>
          <p className="mt-8 text-xl text-emerald-800/70 max-w-2xl font-light leading-relaxed mb-10">
            A curated directory of elite grooming spaces. Experience the highest standard of service in Mumbai's most beautiful studios.
          </p>
          <div className="flex justify-center md:justify-start">
            <Suspense fallback={<div className="h-14 max-w-2xl w-full bg-rose-100/40 animate-pulse rounded-full" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 gap-12">
        {/* LEFT SIDEBAR: FILTERS */}
        <Suspense fallback={<SidebarSkeleton />}>
          <FiltersSidebar searchParamsPromise={searchParams} />
        </Suspense>

        {/* RIGHT CONTENT: GRID */}
        <Suspense fallback={<SalonsGridSkeleton />}>
          <SalonsList searchParamsPromise={searchParams} />
        </Suspense>
      </div>

      {/* FLOATING AI CONCIERGE */}
      <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 group">
        <div className="absolute bottom-full mb-4 right-0 bg-white/80 backdrop-blur-xl border border-white p-6 w-80 rounded-3xl shadow-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none group-focus-within:pointer-events-auto transform translate-y-4 group-focus-within:translate-y-0">
          <p className="font-semibold text-emerald-900 mb-1">AI Concierge</p>
          <p className="text-sm text-emerald-800/60 mb-5 leading-relaxed">Describe your ideal aesthetic experience. We will find your perfect match.</p>
          <div className="flex gap-2 bg-rose-50/50 p-1 rounded-full border border-rose-100">
            <input 
              type="text" 
              placeholder="E.g., minimalist nail art..." 
              className="bg-transparent focus:outline-none w-full text-sm py-2 px-4 placeholder:text-rose-300 text-emerald-900"
            />
            <button className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-sm">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button className="bg-emerald-900 text-rose-50 p-4 rounded-full shadow-xl hover:bg-emerald-800 hover:shadow-rose-900/20 hover:-translate-y-1 transition-all duration-300 focus:outline-none">
          <MessageSquareText className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
}


async function FiltersSidebar({ searchParamsPromise }: { searchParamsPromise: Promise<{ service?: string; location?: string; search?: string }> }) {
  const { service, location, search } = await searchParamsPromise;
  return (
    <aside className="lg:w-1/4 space-y-10">
      <div>
        <h3 className="font-semibold text-sm tracking-widest text-emerald-900 mb-5">SERVICE TYPE</h3>
        <div className="flex flex-wrap lg:flex-col gap-3">
          {["Hair", "Nails", "Makeup", "Skincare"].map((serviceItem) => {
            const isActive = service === serviceItem;
            const newQuery = new URLSearchParams();
            if (!isActive) newQuery.set('service', serviceItem);
            if (location) newQuery.set('location', location);
            if (search) newQuery.set('search', search);
            
            return (
              <Link key={serviceItem} href={`/?${newQuery.toString()}`} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border border-rose-300 transition-colors flex items-center justify-center ${isActive ? 'bg-rose-400 border-rose-400 shadow-sm' : 'group-hover:bg-rose-200'}`}></div>
                <span className={`transition-colors ${isActive ? 'text-emerald-950 font-semibold' : 'text-emerald-900/80 group-hover:text-emerald-900'}`}>{serviceItem}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm tracking-widest text-emerald-900 mb-5">LOCATION ZONE</h3>
        <div className="flex flex-wrap lg:flex-col gap-3">
          {["South Bombay", "Bandra - Juhu", "Andheri - Goregaon", "Eastern Suburbs"].map((zone) => {
            const isActive = location === zone;
            const newQuery = new URLSearchParams();
            if (service) newQuery.set('service', service);
            if (!isActive) newQuery.set('location', zone);
            if (search) newQuery.set('search', search);
            
            return (
              <Link key={zone} href={`/?${newQuery.toString()}`} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border border-rose-300 transition-colors flex items-center justify-center ${isActive ? 'bg-rose-400 border-rose-400 shadow-sm' : 'group-hover:bg-rose-200'}`}></div>
                <span className={`transition-colors ${isActive ? 'text-emerald-950 font-semibold' : 'text-emerald-900/80 group-hover:text-emerald-900'}`}>{zone}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

async function SalonsList({ searchParamsPromise }: { searchParamsPromise: Promise<{ service?: string; location?: string; search?: string }> }) {
  const { service, location, search } = await searchParamsPromise;
  const salons = await getSalonsCached({ service, location, search });
  
  return (
    <div className="lg:w-3/4">
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-rose-200">
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-3xl text-emerald-950">Directory</h3>
          {(service || location || search) && (
            <Link 
              href="/" 
              className="text-xs font-semibold tracking-wider text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors mb-1"
            >
              Clear Filters
            </Link>
          )}
        </div>
        <span className="text-sm font-medium text-emerald-800/60">{salons.length} Curated Studios</span>
      </div>

      {salons.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-rose-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-rose-400" />
          </div>
          <h4 className="text-xl font-medium text-emerald-950 mb-2">No salons found</h4>
          <p className="text-emerald-800/60 max-w-sm mx-auto">We couldn't find any studios matching your current filters. Try selecting a different service or zone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {salons.map((salon: any) => {
            const minPrice = salon.services?.length ? Math.min(...salon.services.map((s: any) => s.price)) : 0;
            return (
              <Link key={salon._id} href={`/salons/${salon._id}`} className="group block cursor-pointer">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-rose-50 relative shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                  <img 
                    src={salon.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=400"} 
                    alt={salon.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h4 className="font-medium text-2xl text-emerald-950 mb-1 group-hover:text-rose-600 transition-colors">{salon.name}</h4>
                
                <div className="flex items-center gap-1 text-sm text-emerald-800/70 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{salon.neighborhood}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-medium text-emerald-900">{minPrice > 0 ? `From ₹${minPrice}` : 'Price Varies'}</span>
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-900 bg-rose-100/50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{salon.overallRating}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="lg:w-1/4 space-y-10 animate-pulse">
      <div>
        <div className="h-4 w-28 bg-rose-100/50 rounded mb-5" />
        <div className="flex flex-wrap lg:flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-100/50" />
              <div className="h-4 w-20 bg-rose-100/50 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-4 w-28 bg-rose-100/50 rounded mb-5" />
        <div className="flex flex-wrap lg:flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-100/50" />
              <div className="h-4 w-24 bg-rose-100/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SalonsGridSkeleton() {
  return (
    <div className="lg:w-3/4 animate-pulse">
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-rose-200">
        <div className="h-8 w-32 bg-rose-100/50 rounded" />
        <div className="h-4 w-28 bg-rose-100/50 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="block">
            <div className="aspect-[4/5] rounded-2xl bg-rose-100/50 mb-5" />
            <div className="h-6 w-3/4 bg-rose-100/50 rounded mb-2" />
            <div className="h-4 w-1/2 bg-rose-100/50 rounded mb-3" />
            <div className="flex justify-between items-center mt-3">
              <div className="h-5 w-16 bg-rose-100/50 rounded" />
              <div className="h-6 w-12 bg-rose-100/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
