import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Salon } from '../src/models/Salon';
import { Booking } from '../src/models/Booking';

// Load env vars
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const salonsData = [
  { 
    name: "THE ARCHIVE", 
    neighborhood: "Bandra West", 
    address: "14B, Mount Mary Road, Bandra West, Mumbai 400050",
    description: "A stark, minimalist space dedicated to precision styling and structural grooming. We focus on form, function, and the highest grade of aesthetic refinement.",
    overallRating: 4.9, 
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "Precision Cut & Style", price: 2500, duration: 60 },
      { name: "Structural Coloring", price: 6000, duration: 120 },
      { name: "Keratin Archive Treatment", price: 8500, duration: 150 },
      { name: "Monochrome Gel Set", price: 1800, duration: 45 },
      { name: "Negative Space Nail Art", price: 2200, duration: 60 },
      { name: "Charcoal Detox Facial", price: 4000, duration: 75 }
    ]
  },
  { 
    name: "VOID STUDIO", 
    neighborhood: "Colaba", 
    address: "22, Apollo Bandar, Colaba, Mumbai 400001",
    description: "Embracing the beauty of emptiness. Void Studio offers a tranquil escape from the city noise with peerless, silent services.",
    overallRating: 4.7, 
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "Silent Precision Cut", price: 3000, duration: 60 },
      { name: "Minimalist Manicure", price: 1500, duration: 45 }
    ]
  },
  { 
    name: "MINIMALIST LAB", 
    neighborhood: "Andheri West", 
    address: "Lokhandwala Complex, Andheri West, Mumbai 400053",
    description: "Scientific precision meets aesthetic beauty. A clinical approach to modern grooming.",
    overallRating: 4.8, 
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "Clinical Cleansing Facial", price: 3500, duration: 60 },
      { name: "Structural Hair Design", price: 4000, duration: 90 }
    ]
  },
  { 
    name: "MONOCHROME", 
    neighborhood: "Juhu", 
    address: "Juhu Tara Road, Juhu, Mumbai 400049",
    description: "High contrast, high impact. Monochrome specializes in striking transformations and bold statements.",
    overallRating: 4.9, 
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "High Contrast Coloring", price: 7000, duration: 150 },
      { name: "Bold Styling", price: 2500, duration: 45 }
    ]
  },
  { 
    name: "STRUCTUR", 
    neighborhood: "Lower Parel", 
    address: "Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    description: "Building beauty from the foundation up. Structur focuses on hair health and architectural styling.",
    overallRating: 4.6, 
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "Architectural Cut", price: 2800, duration: 60 },
      { name: "Foundation Repair Treatment", price: 5000, duration: 90 }
    ]
  },
  { 
    name: "FORM & FUNCTION", 
    neighborhood: "Khar", 
    address: "Linking Road, Khar West, Mumbai 400052",
    description: "Where practical grooming meets elite aesthetics. Flawless execution of essential services.",
    overallRating: 4.8, 
    image: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?auto=format&fit=crop&q=80&w=600&h=400",
    services: [
      { name: "Essential Grooming Package", price: 4500, duration: 90 },
      { name: "Functional Styling", price: 2000, duration: 45 }
    ]
  }
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("No MONGODB_URI found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing collections
    await Salon.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing salons and bookings.");

    // Insert salons
    const insertedSalons = await Salon.insertMany(salonsData);
    console.log(`Inserted ${insertedSalons.length} salons.`);

    // Create some bookings for "THE ARCHIVE" (the first salon)
    const archiveSalon = insertedSalons[0];
    
    const bookingsData = [
      {
        salonId: archiveSalon._id,
        customerName: "Aanya Sharma",
        customerEmail: "aanya@example.com",
        selectedServices: [{ name: "Precision Cut & Style", price: 2500 }],
        status: "completed",
        appointmentTime: new Date(new Date().getTime() - 86400000), // Yesterday
        totalAmount: 2500
      },
      {
        salonId: archiveSalon._id,
        customerName: "Rohan Desai",
        customerEmail: "rohan@example.com",
        selectedServices: [{ name: "Structural Coloring", price: 6000 }],
        status: "confirmed",
        appointmentTime: new Date(new Date().getTime() + 86400000), // Tomorrow
        totalAmount: 6000
      },
      {
        salonId: archiveSalon._id,
        customerName: "Priya Kapoor",
        customerEmail: "priya@example.com",
        selectedServices: [{ name: "Charcoal Detox Facial", price: 4000 }],
        status: "confirmed",
        appointmentTime: new Date(new Date().getTime() + 172800000), // Day after tomorrow
        totalAmount: 4000
      },
      {
        salonId: archiveSalon._id,
        customerName: "Vikram Singh",
        customerEmail: "vikram@example.com",
        selectedServices: [{ name: "Monochrome Gel Set", price: 1800 }],
        status: "pending",
        appointmentTime: new Date(new Date().getTime() + 259200000), // In 3 days
        totalAmount: 1800
      }
    ];

    const insertedBookings = await Booking.insertMany(bookingsData);
    console.log(`Inserted ${insertedBookings.length} bookings.`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
