import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import FestiveOffer from "@/models/FestiveOffer";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  let offer = await FestiveOffer.findOne();

  if (!offer) {
    offer = await FestiveOffer.create({ isActive: false });
  }

  return NextResponse.json(offer);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  let offer = await FestiveOffer.findOne();

  if (!offer) {
    offer = await FestiveOffer.create({ ...body, updatedAt: new Date() });
  } else {
    offer.isActive = body.isActive;
    offer.title = body.title;
    offer.description = body.description;
    offer.discountText = body.discountText;
    offer.updatedAt = new Date();
    await offer.save();
  }

  return NextResponse.json(offer);
}