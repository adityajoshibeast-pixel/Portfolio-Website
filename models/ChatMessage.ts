import mongoose, { Schema, models, model } from "mongoose";

export interface ChatMessageDocument {
  conversationId: string;
  sender: "client" | "admin";
  text?: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>({
  conversationId: { type: String, required: true },
  sender: { type: String, enum: ["client", "admin"], required: true },
  text: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessage = models.ChatMessage || model<ChatMessageDocument>("ChatMessage", ChatMessageSchema);

export default ChatMessage;