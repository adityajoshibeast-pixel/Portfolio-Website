import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Offer from "@/models/Offer";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  const offers = await Offer.find().sort({ createdAt: -1 });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  const offer = await Offer.create({
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl,
    tags: body.tags || [],
    demoLink: body.demoLink,
  });

  return NextResponse.json(offer);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();
  const { id, ...updateData } = body;

  const updated = await Offer.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectToDatabase();
  await Offer.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}