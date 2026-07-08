"use client";

import { useEffect, useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadImage";

export default function ResumeEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      const res = await fetch("/api/resume");
      const data = await res.json();
      setCurrentUrl(data.url || "");
      setLoading(false);
    };
    fetchResume();
  }, []);

  const handleSave = async () => {
    if (!file) return;

    setSaving(true);
    setSaved(false);

    try {
      const url = await uploadToCloudinary(file);

      await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      setCurrentUrl(url);
      setFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">Resume / CV</h2>
      <p className="mt-1 font-body text-sm text-muted">
        Upload a PDF, visitors can download it from your homepage.
      </p>

      {loading ? (
        <p className="mt-4 font-body text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {currentUrl ? (
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-body text-sm text-accent hover:underline">
              View current resume
            </a>
          ) : null}

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full font-body text-sm text-muted"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={!file || saving}
            className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Uploading..." : saved ? "Saved" : "Upload Resume"}
          </button>
        </div>
      )}
    </div>
  );
}