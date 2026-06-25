import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Types ---
export interface ISelectedService {
  name: string;
  price: number;
}

export interface IBooking extends Document {
  salonId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  selectedServices: ISelectedService[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  appointmentTime: Date;
  totalAmount: number;
}

// --- Schemas ---
const SelectedServiceSchema = new Schema<ISelectedService>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const BookingSchema = new Schema<IBooking>({
  salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  selectedServices: [SelectedServiceSchema],
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  appointmentTime: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

// Prevent mongoose overwrite error in Next.js HMR
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}
export const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
