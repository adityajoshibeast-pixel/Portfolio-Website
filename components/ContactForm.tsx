"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="w-full rounded-lg border border-surface-2 bg-surface px-4 py-2 font-body text-text outline-none focus:border-accent"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="w-full rounded-lg border border-surface-2 bg-surface px-4 py-2 font-body text-text outline-none focus:border-accent"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        rows={4}
        required
        className="w-full rounded-lg border border-surface-2 bg-surface px-4 py-2 font-body text-text outline-none focus:border-accent"
      />

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-center font-body text-sm text-accent">
          Message sent! I'll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-center font-body text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}