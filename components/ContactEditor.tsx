"use client";

import { useEffect, useState } from "react";

export default function ContactEditor() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setLinkedin(data.linkedin || "");
      setGithub(data.github || "");
      setInstagram(data.instagram || "");
      setLoading(false);
    };
    fetchContact();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, linkedin, github, instagram }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">Contact Details</h2>
      <p className="mt-1 font-body text-sm text-muted">
        These appear in your public site's footer.
      </p>

      {loading ? (
        <p className="mt-4 font-body text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <label className="font-body text-sm text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXXXXXXX"
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">LinkedIn URL (optional)</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">GitHub URL (optional)</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">Instagram URL (optional)</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Contact Details"}
          </button>
        </div>
      )}
    </div>
  );
}