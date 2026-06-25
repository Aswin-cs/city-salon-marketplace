'use client';

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { CancelBookingButton } from "./CancelBookingButton";

interface ProfileBookingsClientProps {
  initialBookings: any[];
}

type StatusFilter = "all" | "live" | "cancelled";
type SortOption = "date-desc" | "date-asc" | "price-desc" | "price-asc";

export function ProfileBookingsClient({ initialBookings }: ProfileBookingsClientProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Filtering Logic
  const filteredBookings = initialBookings.filter((booking) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "cancelled") return booking.status === "cancelled";
    if (statusFilter === "live") return booking.status !== "cancelled";
    return true;
  });

  // Sorting Logic
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const timeA = new Date(a.appointmentTime).getTime();
    const timeB = new Date(b.appointmentTime).getTime();

    if (sortBy === "date-desc") return timeB - timeA;
    if (sortBy === "date-asc") return timeA - timeB;
    if (sortBy === "price-desc") return b.totalAmount - a.totalAmount;
    if (sortBy === "price-asc") return a.totalAmount - b.totalAmount;
    return 0;
  });

  const clearFilters = () => {
    setStatusFilter("all");
    setSortBy("date-desc");
  };

  return (
    <div className="space-y-8">
      {/* FILTERS PANEL */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-rose-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "live", "cancelled"] as StatusFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                statusFilter === tab
                  ? "bg-emerald-900 text-white shadow-sm shadow-emerald-900/10"
                  : "bg-rose-50/30 text-emerald-900 border border-rose-100/60 hover:border-rose-300"
              }`}
            >
              {tab === "all" ? "All Bookings" : tab === "live" ? "Live (Active)" : "Cancelled"}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-1.5 text-emerald-800/60 text-xs font-semibold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-rose-50/30 text-emerald-950 border border-rose-100/60 rounded-full pl-5 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-300 transition-all cursor-pointer"
            >
              <option value="date-desc">Date: Latest First</option>
              <option value="date-asc">Date: Oldest First</option>
              <option value="price-desc">Price: Highest First</option>
              <option value="price-asc">Price: Lowest First</option>
            </select>
            <ChevronDown className="w-4 h-4 text-emerald-900/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* BOOKINGS LIST */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-50">
          <Calendar className="w-12 h-12 text-rose-200 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-emerald-950 mb-2">No bookings found</h4>
          <p className="text-emerald-800/60 mb-6 max-w-sm mx-auto">
            We couldn't find any bookings matching your current filter settings.
          </p>
          <button
            onClick={clearFilters}
            className="inline-block px-6 py-2.5 bg-emerald-900 text-white rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking: any) => {
            const date = new Date(booking.appointmentTime);
            const isUpcoming = date > new Date();

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Details Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-xl font-semibold text-emerald-950">
                      {booking.salonId?.name || "Unknown Salon"}
                    </h4>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        booking.status === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : isUpcoming
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {booking.status === "cancelled" ? "Cancelled" : isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm font-medium text-emerald-800/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      {booking.salonId?.address || "Address unavailable"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-rose-400" />
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Pricing & Services Section */}
                <div className="md:border-l border-rose-100 md:pl-6 flex flex-col justify-center min-w-[200px]">
                  <p className="text-xs font-bold tracking-widest text-emerald-800/50 mb-2">SERVICES</p>
                  <ul className="space-y-1 mb-4">
                    {booking.selectedServices?.map((service: any, idx: number) => (
                      <li key={idx} className="text-sm font-medium text-emerald-950 flex justify-between">
                        <span>{service.name}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-rose-50">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-emerald-800/50 block mb-1">
                        TOTAL (PAY OFFLINE)
                      </span>
                      <span className="text-lg font-bold text-emerald-900">₹{booking.totalAmount}</span>
                    </div>
                    {isUpcoming && booking.status !== "cancelled" && (
                      <CancelBookingButton bookingId={booking._id} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
