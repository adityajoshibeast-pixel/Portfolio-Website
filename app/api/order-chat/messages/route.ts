import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatMessage from "@/models/ChatMessage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  await connectToDatabase();
  const messages = await ChatMessage.find({ conversationId }).sort({ createdAt: 1 });

  return NextResponse.json(messages);
}