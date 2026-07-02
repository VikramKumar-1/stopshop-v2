import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authResult = requireRole(req, ["admin", "vendor"]);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await req.json();
    const { productName, category = "General", material = "Standard", promptType = "description" } = body;

    if (!productName || typeof productName !== "string") {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const cleanName = productName.trim();
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    // If live API key is configured, attempt live call
    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Write a premium, SEO-optimized e-commerce product description for a product named "${cleanName}" in the category "${category}" made of "${material}". Include 2 engaging paragraphs and 3 key highlight bullet points formatted cleanly.`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({ success: true, text: generatedText, source: "gemini_ai" });
          }
        }
      } catch (err) {
        console.warn("Live AI generation failed, falling back to smart engine:", err);
      }
    }

    // High-converting smart fallback engine (Ensures zero site crashes when API key is unconfigured)
    let generatedText = "";
    if (promptType === "tags") {
      generatedText = `${cleanName.toLowerCase().replace(/\s+/g, ", ")}, authentic ${category.toLowerCase()}, premium ${material.toLowerCase()}, handcrafted quality, stopshop bestseller`;
    } else {
      generatedText = `Experience the unmatched craftsmanship of our ${cleanName}. Specially curated under the ${category} collection, this product combines traditional artistry with modern durability, made from genuine ${material}.\n\n✨ Key Highlights:\n• Authentic & Premium Quality: Carefully inspected to meet strict StopShop standards.\n• Versatile & Elegant Design: Perfect for everyday use or special occasions.\n• Sustainable Craftsmanship: Handcrafted with long-lasting ${material} for superior finish and feel.\n\nElevate your lifestyle with this timeless masterpiece. Order now for secure packaging and fast delivery across India.`;
    }

    return NextResponse.json({ success: true, text: generatedText, source: "smart_engine" });
  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate content" }, { status: 500 });
  }
}
