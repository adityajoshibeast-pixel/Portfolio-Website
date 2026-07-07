import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  const resume = await Resume.findOne();
  return NextResponse.json(resume || { url: "" });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  let resume = await Resume.findOne();

  if (!resume) {
    resume = await Resume.create({ url: body.url, updatedAt: new Date() });
  } else {
    resume.url = body.url;
    resume.updatedAt = new Date();
    await resume.save();
  }

  return NextResponse.json(resume);
}