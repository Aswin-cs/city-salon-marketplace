import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import { Salon } from "@/models/Salon";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "AI Concierge is currently unavailable (API Key missing)." },
        { status: 500 }
      );
    }

    await dbConnect();

    // Fetch minimal salon data for context to avoid huge payload
    const salons = await Salon.find({}, "name neighborhood address overallRating services.name services.price");
    const salonContext = JSON.stringify(salons);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an elite, minimalist urban grooming concierge assistant for Mumbai. 
Use the provided salon data context to return highly specific recommendations in plain text, 
finishing with a direct Markdown link reference to /salons/[id]. Keep your tone stark, professional, and refined.

Available Salons Context:
${salonContext}`,
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json(
      { success: true, data: responseText },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in AI Concierge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process AI request." },
      { status: 500 }
    );
  }
}
