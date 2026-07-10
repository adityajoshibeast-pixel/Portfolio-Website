import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatMessage from "@/models/ChatMessage";
import ChatConversation from "@/models/ChatConversation";
import pusherServer from "@/lib/pusherServer";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { conversationId, sender, text, fileUrl, fileType, clientName } = body;

  if (!conversationId || !sender) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (sender === "admin") {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await connectToDatabase();

  const message = await ChatMessage.create({
    conversationId,
    sender,
    text,
    fileUrl,
    fileType,
  });

  const updateData: any = {
    lastMessage: text || (fileType ? `[${fileType}]` : ""),
    lastSender: sender,
    updatedAt: new Date(),
  };

  if (sender === "client") {
    updateData.adminUnread = true;
    if (clientName) updateData.clientName = clientName;
  } else {
    updateData.clientUnread = true;
    updateData.adminUnread = false;
  }

  await ChatConversation.findOneAndUpdate(
    { conversationId },
    { $set: updateData, $setOnInsert: { conversationId } },
    { upsert: true, new: true }
  );

  await pusherServer.trigger(`order-chat-${conversationId}`, "new-message", message);
  await pusherServer.trigger("admin-chats", "conversation-updated", { conversationId });

  return NextResponse.json(message);
}