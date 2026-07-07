import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await connectToDatabase();
  const contact = await Contact.findOne();
  const yourEmail = (contact as any)?.email;

  if (!yourEmail) {
    return NextResponse.json({ error: "Contact email not configured" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: yourEmail,
      replyTo: email,
      subject: `New message from ${name} (Portfolio Site)`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}