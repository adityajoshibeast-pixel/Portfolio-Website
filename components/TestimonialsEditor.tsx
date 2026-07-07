"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
};

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = "";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, quote, imageUrl }),
    });

    setName("");
    setRole("");
    setQuote("");
    setFile(null);
    setSaving(false);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">Testimonials</h2>
      <p className="mt-1 font-body text-sm text-muted">
        Reviews from clients or collaborators, shown on your homepage.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client name"
          className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          required
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role / Company (e.g., Founder, XYZ Startup)"
          className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          required
        />
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="What did they say about your work?"
          rows={3}
          className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full font-body text-sm text-muted"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Testimonial"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="flex items-center justify-between rounded-xl border border-surface-2 bg-bg p-3"
          >
            <div>
              <p className="font-body text-sm font-medium text-text">{t.name}</p>
              <p className="font-body text-xs text-muted">{t.role}</p>
            </div>
            <button
              onClick={() => handleDelete(t._id)}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 font-body text-xs text-red-400 hover:bg-red-400/10"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}