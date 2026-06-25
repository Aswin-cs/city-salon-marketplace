'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { 
        method: 'PATCH' 
      });
      
      if (res.ok) {
        setShowConfirm(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        setErrorMessage(`Failed to cancel: ${errorData.message}`);
        setIsCancelling(false);
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
      setIsCancelling(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isCancelling}
        className="text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2 md:mt-0"
      >
        <XCircle className="w-3.5 h-3.5" />
        {isCancelling ? 'Cancelling...' : 'Cancel'}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 lg:p-8 transform scale-100 transition-transform">
            <h3 className="font-medium text-2xl text-emerald-950 mb-2">Cancel Booking?</h3>
            <p className="text-emerald-800/70 text-sm mb-6 leading-relaxed">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            
            {errorMessage && (
              <div className="mb-6 bg-rose-50 text-rose-800 p-3 rounded-xl text-sm font-medium border border-rose-100">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isCancelling}
                className="flex-1 bg-rose-50 text-emerald-900 py-3 rounded-xl font-medium tracking-wide hover:bg-rose-100 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20 disabled:opacity-50"
              >
                {isCancelling ? 'Processing' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
