import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import About from "@/models/About";
import Offer from "@/models/Offer";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  await connectToDatabase();
  const about = await About.findOne().lean();
  const offers = await Offer.find().lean();
  const contact = await Contact.findOne().lean();

  const aboutText = (about as any)?.content?.replace(/<[^>]*>/g, "") || "No about info yet.";
  const projectsText = offers
    .map((o: any) => `- ${o.title}: ${o.description} (Tags: ${(o.tags || []).join(", ")})`)
    .join("\n");
  const contactText = (contact as any)?.email
    ? `Email: ${(contact as any).email}`
    : "No contact info shared yet.";

  const systemPrompt = `You are a helpful assistant on Aditya's developer portfolio website. Answer visitor questions about Aditya, his skills, and his projects, using ONLY the information below. Be friendly and concise. If asked something outside this info, politely say you don't have that detail and suggest contacting Aditya directly.

About Aditya:
${aboutText}

Projects:
${projectsText || "No projects listed yet."}

Contact:
${contactText}`;

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await groqRes.json();

  if (!groqRes.ok) {
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }

  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

  return NextResponse.json({ reply });
}