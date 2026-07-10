import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatConversation from "@/models/ChatConversation";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { conversationId, role } = body;

  if (!conversationId || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (role === "admin") {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await connectToDatabase();

  const field = role === "admin" ? "adminUnread" : "clientUnread";
  await ChatConversation.findOneAndUpdate({ conversationId }, { $set: { [field]: false } });

  return NextResponse.json({ success: true });
}