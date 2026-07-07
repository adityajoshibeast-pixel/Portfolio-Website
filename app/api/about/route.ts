import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import About from "@/models/About";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  let about = await About.findOne();

  if (!about) {
    about = await About.create({ content: "" });
  }

  return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  let about = await About.findOne();

  if (!about) {
    about = await About.create({
      content: body.content,
      imageUrl: body.imageUrl,
      updatedAt: new Date(),
    });
  } else {
    about.content = body.content;
    if (body.imageUrl) {
      about.imageUrl = body.imageUrl;
    }
    about.updatedAt = new Date();
    await about.save();
  }

  return NextResponse.json(about);
}