"use client";

import { useEffect, useState } from "react";

export default function FestiveOfferEditor() {
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountText, setDiscountText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      const res = await fetch("/api/festive-offer");
      const data = await res.json();
      setIsActive(data.isActive || false);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setDiscountText(data.discountText || "");
      setLoading(false);
    };
    fetchOffer();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    await fetch("/api/festive-offer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive, title, description, discountText }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text">Festive Offer</h2>
        <label className="flex cursor-pointer items-center gap-2">
          <span className="font-body text-sm text-muted">
            {isActive ? "Active" : "Inactive"}
          </span>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-surface-2 outline-none transition-colors checked:bg-accent relative before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-bg before:transition-transform checked:before:translate-x-4"
          />
        </label>
      </div>
      <p className="mt-1 font-body text-sm text-muted">
        Turn this on during sales/festivals — a banner will appear on your homepage.
      </p>

      {loading ? (
        <p className="mt-4 font-body text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g., Diwali Special Offer!)"
            className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          />
          <input
            type="text"
            value={discountText}
            onChange={(e) => setDiscountText(e.target.value)}
            placeholder="Discount text (e.g., Flat 20% off on all projects)"
            className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Extra details (optional)"
            rows={2}
            className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Offer"}
          </button>
        </div>
      )}
    </div>
  );
}