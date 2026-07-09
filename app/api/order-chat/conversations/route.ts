import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatConversation from "@/models/ChatConversation";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const conversations = await ChatConversation.find().sort({ updatedAt: -1 });

  return NextResponse.json(conversations);
}