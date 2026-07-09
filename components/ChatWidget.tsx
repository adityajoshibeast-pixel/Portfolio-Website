"use client";

import { useState, useRef, useEffect } from "react"

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm AskAditya 🤖 — ask me anything about Aditya's projects, skills or about him." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setHasOpened(true);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[420px] w-[340px] flex-col overflow-hidden rounded-2xl border border-surface-2 bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-2 bg-surface-2/50 px-4 py-3">
            <span className="font-mono text-sm text-accent">AskAditya 🤖</span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-body text-sm text-muted hover:text-text"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 font-body text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-accent text-bg"
                    : "bg-surface-2 text-text"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-xl bg-surface-2 px-3 py-2 font-body text-sm text-muted">
                Typing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-surface-2 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-surface-2 bg-bg px-3 py-2 font-body text-sm text-text outline-none focus:border-accent"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-lg bg-accent px-3 py-2 font-body text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}

    
        {!isOpen && !hasOpened && (
  <div className="fixed bottom-8 right-24 z-50 hidden animate-bounce rounded-xl border border-surface-2 bg-surface px-3 py-2 shadow-lg sm:block">
          <p className="whitespace-nowrap font-body text-xs font-medium text-text">
            Ask me anything! 👋
          </p>
          <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-surface-2 bg-surface" />
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
        )}
        <button
          onClick={handleOpen}
         className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent text-bg shadow-lg transition-transform hover:scale-105 cursor-pointer sm:h-14 sm:w-14"
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>
    </>
  );
}