"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { requestNotificationPermission, showNotification } from "@/lib/notifications";

type Conversation = {
  _id: string;
  conversationId: string;
  clientName: string;
  lastMessage: string;
  lastSender: string;
  adminUnread: boolean;
  updatedAt: string;
};

type Message = {
  _id?: string;
  sender: "client" | "admin";
  text?: string;
  fileUrl?: string;
  fileType?: string;
};

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    const res = await fetch("/api/order-chat/conversations");
    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchConversations();

    const pusher = getPusherClient();
    const channel = pusher.subscribe("admin-chats");
    channel.bind("conversation-updated", (data: any) => {
  fetchConversations();
  if (data.sender === "client" && data.conversationId !== activeId) {
    showNotification(`New message from ${data.clientName || "a client"}`, data.text || "Sent an attachment");
  }
});

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-chats");
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/order-chat/messages?conversationId=${activeId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();

    fetch("/api/order-chat/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeId, role: "admin" }),
    }).then(() => fetchConversations());

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`order-chat-${activeId}`);
    channel.bind("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`order-chat-${activeId}`);
    };
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if ((!text.trim() && !file) || sending || !activeId) return;
    setSending(true);

    try {
      let fileUrl = "";
      let fileType = "";

      if (file) {
        fileUrl = await uploadToCloudinary(file);
        if (file.type.startsWith("image/")) fileType = "image";
        else if (file.type.startsWith("video/")) fileType = "video";
        else fileType = "pdf";
      }

      await fetch("/api/order-chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeId,
          sender: "admin",
          text,
          fileUrl,
          fileType,
        }),
      });

      setText("");
      setFile(null);
    } catch {
      alert("Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (conversationId: string) => {
    if (!confirm("Delete this conversation? This cannot be undone.")) return;

    await fetch(`/api/order-chat/conversations?conversationId=${conversationId}`, {
      method: "DELETE",
    });

    if (activeId === conversationId) {
      setActiveId(null);
      setMessages([]);
    }
    fetchConversations();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-bg">
      <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-surface-2">
        <div className="border-b border-surface-2 p-4">
          <h1 className="font-display text-lg font-semibold text-text">Order Chats</h1>
        </div>
        {conversations.length === 0 && (
          <p className="p-4 font-body text-sm text-muted">No conversations yet.</p>
        )}
        {conversations.map((c) => (
          <div
            key={c.conversationId}
            className={`group flex items-center border-b border-surface-2 transition-colors hover:bg-surface ${
              activeId === c.conversationId ? "bg-surface" : ""
            }`}
          >
            <button
              onClick={() => setActiveId(c.conversationId)}
              className="min-w-0 flex-1 cursor-pointer p-4 text-left"
            >
              <div className="flex items-center gap-2">
                {c.adminUnread && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                )}
                <p className="truncate font-body text-sm font-medium text-text">{c.clientName}</p>
              </div>
              <p className="mt-1 truncate font-body text-xs text-muted">
                {c.lastSender === "admin" ? "You: " : ""}
                {c.lastMessage}
              </p>
            </button>
            <button
              onClick={() => handleDelete(c.conversationId)}
              className="mr-3 flex-shrink-0 cursor-pointer rounded-lg px-2 py-1 font-body text-xs text-muted opacity-0 hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
              title="Delete conversation"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        {!activeId ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-body text-sm text-muted">Select a conversation to view messages.</p>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-6">
              {messages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  className={`max-w-md rounded-xl px-4 py-2 font-body text-sm ${
                    msg.sender === "admin" ? "ml-auto bg-accent text-bg" : "bg-surface-2 text-text"
                  }`}
                >
                  {msg.fileUrl && msg.fileType === "image" && (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                      <img src={msg.fileUrl} alt="attachment" className="mb-1 max-h-60 rounded-lg" />
                    </a>
                  )}
                  {msg.fileUrl && msg.fileType === "video" && (
                    <video src={msg.fileUrl} controls className="mb-1 max-h-60 rounded-lg" />
                  )}
                  {msg.fileUrl && (msg.fileType === "pdf" || msg.fileType === "video") && (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mb-1 block underline">
                      Download {msg.fileType === "pdf" ? "PDF" : "video"}
                    </a>
                  )}
                  {msg.text ? <p>{msg.text}</p> : null}
                </div>
              ))}
            </div>

            <div className="border-t border-surface-2 p-4">
              {file && <p className="mb-2 font-body text-xs text-muted">Attached: {file.name}</p>}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-lg border border-surface-2 px-3 py-2 font-body text-sm text-muted hover:border-accent/40">
                  Attach
                  <input
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a reply..."
                  className="flex-1 rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-sm text-text outline-none focus:border-accent"
                />
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="cursor-pointer rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}