"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Service {
  _id?: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceMenuClientProps {
  salonId: string;
  services: Service[];
  session: any;
}

export function ServiceMenuClient({ salonId, services, session }: ServiceMenuClientProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setBookingStatus('idle');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !session?.user || !selectedDate || !selectedTime) return;
    
    setIsBooking(true);
    setErrorMessage('');
    
    const appointmentTime = new Date(selectedDate);
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    appointmentTime.setHours(hours, minutes, 0, 0);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          selectedServices: [selectedService],
          appointmentTime: appointmentTime.toISOString(),
          totalAmount: selectedService.price
        })
      });
      
      if (res.ok) {
        setBookingStatus('success');
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Failed to book');
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {services?.map((service: Service) => (
          <div key={service._id || service.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-rose-50 group">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-medium text-lg text-emerald-950 group-hover:text-rose-600 transition-colors">{service.name}</h4>
              <p className="text-sm font-medium text-emerald-800/60 mt-1">{service.duration} Min</p>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <span className="font-medium text-xl text-emerald-900">₹{service.price}</span>
              <button 
                onClick={() => handleSelectService(service)}
                className="bg-rose-50 text-emerald-900 px-6 py-2 rounded-full font-semibold text-sm tracking-wide hover:bg-rose-500 hover:text-white transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-transform">
            
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-rose-100 bg-[#FAF9F6]">
              <h3 className="font-medium text-2xl text-emerald-950">
                {bookingStatus === 'success' ? 'Booking Confirmed' : 'Book Appointment'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-emerald-800 hover:bg-rose-100 transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {bookingStatus === 'success' ? (
              <div className="p-8 text-center py-16">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-2xl font-semibold text-emerald-950 mb-2">You're all set!</h4>
                <p className="text-emerald-800/70 mb-8">
                  Your appointment for the <span className="font-medium text-emerald-900">{selectedService?.name}</span> is confirmed. 
                  You can view the details in your profile.
                </p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-medium tracking-wide hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 lg:p-8 overflow-y-auto">
                  {errorMessage && (
                    <div className="mb-6 bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-medium border border-rose-100">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mb-8 p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <p className="font-semibold text-xs tracking-widest text-emerald-800/60 mb-2">SELECTED SERVICE</p>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-xl text-emerald-950">{selectedService?.name}</h4>
                      <span className="font-medium text-xl text-emerald-900">₹{selectedService?.price}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-rose-100/60 flex items-center justify-between text-xs text-rose-600 font-semibold tracking-wide">
                      <span>Payment Mode</span>
                      <span>Pay Offline at Salon (No Online Payment)</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-xs tracking-widest text-emerald-900 mb-4">SELECT DATE</h4>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() + i);
                          const isSelected = selectedDate?.toDateString() === d.toDateString();
                          return (
                            <button 
                              key={d.toISOString()}
                              type="button"
                              onClick={() => setSelectedDate(d)}
                              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'bg-white border border-rose-100 hover:border-rose-300 text-emerald-900'}`}
                            >
                              <span className="text-xs font-semibold mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                              <span className="text-xl font-medium">{d.getDate()}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs tracking-widest text-emerald-900 mb-4">SELECT TIME</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"].map((time, i) => (
                          <button 
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-xl font-medium text-sm transition-all ${selectedTime === time ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'bg-white border border-rose-100 hover:border-rose-300 text-emerald-900'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8 border-t border-rose-100 bg-[#FAF9F6]">
                  <p className="text-center text-xs text-rose-500 font-medium tracking-wide mb-4">
                    * Direct payment at salon. No online payment options available.
                  </p>
                  {session ? (
                    <button 
                      onClick={handleConfirmBooking}
                      disabled={isBooking || !selectedDate || !selectedTime}
                      className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-medium text-lg tracking-wide hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? 'Processing...' : `Confirm Booking`}
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        router.push('/login');
                      }}
                      className="w-full bg-rose-600 text-white py-4 rounded-2xl font-medium text-lg tracking-wide hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20"
                    >
                      Sign in to Book
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
