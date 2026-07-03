import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authResult = requireRole(req, ["admin", "vendor"]);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await req.json();
    const {
      productName,
      category = "General",
      material = "Standard",
      price = "",
      specs = "",
      finish = "",
      capacity = "",
      promptType = "description"
    } = body;

    if (!productName || typeof productName !== "string") {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const cleanName = productName.trim();
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    // Build context string from specs
    const specDetails = [
      material && material !== "Standard" ? `Material: Pure ${material}` : "",
      finish ? `Finish: ${finish}` : "",
      capacity ? `Capacity: ${capacity}` : "",
      price ? `Price: ₹${price}` : "",
      specs ? `Specifications: ${typeof specs === "string" ? specs : JSON.stringify(specs)}` : ""
    ].filter(Boolean).join(", ");

    // If live API key is configured, attempt live call
    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Act as an expert e-commerce copywriter and SEO specialist for "StopShop", a luxury marketplace for traditional metalwork (bronze, brass, copper, steel).
Given the rough product input:
- Rough Item Name: "${cleanName}"
- Category: "${category}"
- Base Material: "${material}"
- Additional Specs/Details: "${specDetails || 'Handcrafted quality'}"

Generate a JSON object with strictly these fields:
{
  "suggestedTitle": "A concise, clean, luxury marketplace title (max 45-50 characters) e.g. 'Pure Copper Hammered Water Bottle (1L)'",
  "description": "Two engaging paragraphs describing the heritage, health/functional benefits, and quality, followed by 3 clean bullet points under ✨ Key Highlights:",
  "seoTitle": "SEO meta title optimized for Google search ranking (max 60 chars) e.g. 'Pure Copper Hammered Bottle | Ayurvedic | StopShop'",
  "seoDescription": "High click-through meta description (max 155 chars) summarizing quality and price.",
  "seoKeywords": "5-7 comma-separated high-intent search tags e.g. 'copper bottle, ayurvedic vessel, hammered water dispenser, handcrafted metalware'"
}
Return ONLY valid JSON without markdown fencing if possible.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          try {
            const cleanJsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJsonStr);
            return NextResponse.json({
              success: true,
              suggestedTitle: parsed.suggestedTitle || cleanName,
              text: parsed.description || rawText,
              seoTitle: parsed.seoTitle || `${cleanName} | StopShop`,
              seoDescription: parsed.seoDescription || `Shop authentic ${cleanName} crafted from pure ${material}.`,
              seoKeywords: parsed.seoKeywords || `${cleanName}, ${category}, ${material}`,
              source: "gemini_ai"
            });
          } catch (e) {
            if (rawText) {
              return NextResponse.json({ success: true, text: rawText, source: "gemini_ai" });
            }
          }
        }
      } catch (err) {
        console.warn("Live AI generation failed, falling back to smart engine:", err);
      }
    }

    // High-converting smart fallback engine (Ensures zero site crashes when API key is unconfigured)
    const formattedCat = category.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const conciseName = cleanName.replace(/\b\w/g, (l: string) => l.toUpperCase());
    const polishedTitle = conciseName.toLowerCase().includes(material.toLowerCase())
      ? `${conciseName}${capacity ? ` (${capacity})` : ""}`
      : `Pure ${material} ${conciseName}${capacity ? ` (${capacity})` : ""}`;

    const generatedText = `Experience the unmatched craftsmanship of our ${polishedTitle}. Specially curated under the ${formattedCat} collection, this masterpiece combines traditional metalwork artistry with modern everyday durability, hand-beaten from genuine, high-grade ${material}.\n\nDesigned to retain natural wellness and timeless aesthetics, it serves as a functional essential and a statement decor piece. Every unit undergoes rigorous finishing to ensure superior quality and longevity.\n\n✨ Key Highlights:\n• Authentic & Pure ${material}: Crafted and tested to meet strict StopShop luxury standards.\n• Ergonomic & Aesthetic Finish: ${finish ? `Exquisite ${finish} finish` : "Sleek handcrafted polish"} suitable for modern households.\n• Health & Heritage Benefits: Retains traditional purity with durable, leak-proof architecture.\n\nElevate your lifestyle with this timeless artifact. Order now for safe packaging and fast express delivery.`;

    const seoTitle = `${polishedTitle.slice(0, 45)} | Pure ${material} | StopShop`;
    const seoDesc = `Buy authentic ${polishedTitle}. Handcrafted ${material} ideal for ${formattedCat}.${price ? ` Best price ₹${price}.` : ""} Fast delivery across India.`;
    const seoKeywords = `${cleanName.toLowerCase()}, pure ${material.toLowerCase()}, ${formattedCat.toLowerCase()}, authentic ${material.toLowerCase()} utensils, stopshop luxury craft`;

    if (promptType === "tags") {
      return NextResponse.json({ success: true, text: seoKeywords, source: "smart_engine" });
    }

    return NextResponse.json({
      success: true,
      suggestedTitle: polishedTitle,
      text: generatedText,
      seoTitle: seoTitle,
      seoDescription: seoDesc,
      seoKeywords: seoKeywords,
      source: "smart_engine"
    });
  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate content" }, { status: 500 });
  }
}
