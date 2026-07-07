import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  let contact = await Contact.findOne();

  if (!contact) {
    contact = await Contact.create({ email: "" });
  }

  return NextResponse.json(contact);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  let contact = await Contact.findOne();

  if (!contact) {
    contact = await Contact.create({ ...body, updatedAt: new Date() });
  } else {
    contact.email = body.email;
    contact.phone = body.phone;
    contact.linkedin = body.linkedin;
    contact.github = body.github;
    contact.instagram = body.instagram;
    contact.updatedAt = new Date();
    await contact.save();
  }

  return NextResponse.json(contact);
}