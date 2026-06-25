import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Types ---
export interface IService {
  name: string;
  price: number;
  duration: number;
}

export interface ISalon extends Document {
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  overallRating: number;
  services: IService[];
  image?: string;
}

// --- Schemas ---
const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
});

const SalonSchema = new Schema<ISalon>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  neighborhood: { type: String, required: true },
  overallRating: { type: Number, default: 0 },
  services: [ServiceSchema],
  image: { type: String },
}, { timestamps: true });

// Prevent mongoose overwrite error in Next.js HMR
export const Salon: Model<ISalon> = mongoose.models.Salon || mongoose.model<ISalon>('Salon', SalonSchema);
