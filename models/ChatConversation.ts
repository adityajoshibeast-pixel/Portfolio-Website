import mongoose, { Schema, models, model } from "mongoose";

export interface ChatConversationDocument {
  conversationId: string;
  clientName: string;
  lastMessage: string;
  lastSender: "client" | "admin";
  updatedAt: Date;
}

const ChatConversationSchema = new Schema<ChatConversationDocument>({
  conversationId: { type: String, required: true, unique: true },
  clientName: { type: String, default: "Visitor" },
  lastMessage: { type: String, default: "" },
  lastSender: { type: String, enum: ["client", "admin"], default: "client" },
  updatedAt: { type: Date, default: Date.now },
});

const ChatConversation =
  models.ChatConversation || model<ChatConversationDocument>("ChatConversation", ChatConversationSchema);

export default ChatConversation;