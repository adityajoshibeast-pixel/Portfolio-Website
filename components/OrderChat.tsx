"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { getPusherClient } from "@/lib/pusherClient";
import { uploadToCloudinary } from "@/lib/uploadImage";

type Message = {
  _id?: string;
  sender: "client" | "admin";
  text?: string;
  fileUrl?: string;
  fileType?: string;
};

function getConversationIdFromEmail(email: string) {
  return email.replace(/[^a-zA-Z0-9]/g, "_");
}

export default function OrderChat() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clientEmail = session?.user?.email || "";
  const clientName = session?.user?.name || "";
  const conversationId = clientEmail ? getConversationIdFromEmail(clientEmail) : "";

  useEffect(() => {
    if (!conversationId) return;

    const fetchHistory = async () => {
      const res = await fetch(`/api/order-chat/messages?conversationId=${conversationId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchHistory();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`order-chat-${conversationId}`);
    channel.bind("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`order-chat-${conversationId}`);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if ((!text.trim() && !file) || sending || !conversationId) return;
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
          conversationId,
          sender: "client",
          text,
          fileUrl,
          fileType,
          clientName,
        }),
      });

      setText("");
      setFile(null);
    } catch {
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => {
    if (!session) {
      signIn("google", { callbackUrl: window.location.href });
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && session && (
        <div className="fixed bottom-24 left-6 z-50 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-surface-2 bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-2 bg-surface-2/50 px-4 py-3">
            <span className="font-mono text-sm text-accent">Order Chat</span>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer font-body text-sm text-muted hover:text-text">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-center font-body text-xs text-muted">
                Hi {clientName?.split(" ")[0]}! Send a message to place your order, you can attach images, PDFs, or videos.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={msg._id || i}
                className={`max-w-[85%] rounded-xl px-3 py-2 font-body text-sm ${
                  msg.sender === "client" ? "ml-auto bg-accent text-bg" : "bg-surface-2 text-text"
                }`}
              >
                {msg.fileUrl && msg.fileType === "image" && (
                  <img src={msg.fileUrl} alt="attachment" className="mb-1 max-h-40 rounded-lg" />
                )}
                {msg.fileUrl && msg.fileType === "video" && (
                  <video src={msg.fileUrl} controls className="mb-1 max-h-40 rounded-lg" />
                )}
                {msg.fileUrl && msg.fileType === "pdf" && (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mb-1 block underline">
                    View PDF
                  </a>
                )}
                {msg.text ? <p>{msg.text}</p> : null}
              </div>
            ))}
          </div>

          <div className="border-t border-surface-2 p-3">
            {file && <p className="mb-2 truncate font-body text-xs text-muted">Attached: {file.name}</p>}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-surface-2 px-2.5 py-2 font-body text-sm text-muted hover:border-accent/40">
                +
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
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-surface-2 bg-bg px-3 py-2 font-body text-sm text-text outline-none focus:border-accent"
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="cursor-pointer rounded-lg bg-accent px-3 py-2 font-body text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={status === "loading"}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {isOpen ? "✕" : "🛒"}
      </button>
    </>
  );
}