import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  const testimonial = await Testimonial.create({
    name: body.name,
    role: body.role,
    quote: body.quote,
    imageUrl: body.imageUrl,
  });

  return NextResponse.json(testimonial);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectToDatabase();
  await Testimonial.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}