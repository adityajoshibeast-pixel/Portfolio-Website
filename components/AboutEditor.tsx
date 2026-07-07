"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (editorRef.current) {
        editorRef.current.innerHTML = data.content || "";
      }
      if (data.imageUrl) {
        setCurrentImageUrl(data.imageUrl);
      }
      setLoading(false);
    };
    fetchAbout();
  }, []);

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const content = editorRef.current?.innerHTML || "";
    let imageUrl = "";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, ...(imageUrl && { imageUrl }) }),
    });

    if (imageUrl) {
      setCurrentImageUrl(imageUrl);
    }

    setFile(null);
    setPreviewUrl("");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">About Section</h2>
      <p className="mt-1 font-body text-sm text-muted">
        This text and photo appear on your public homepage.
      </p>

      {loading ? (
        <p className="mt-4 font-body text-sm text-muted">Loading...</p>
      ) : (
        <>
          <div className="mt-4">
            <label className="font-body text-sm text-muted">Your Photo</label>

            {(previewUrl || currentImageUrl) && (
              <img
                src={previewUrl || currentImageUrl}
                alt="About preview"
                className="mt-2 h-32 w-32 rounded-xl object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full font-body text-sm text-muted"
            />
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm font-bold text-text hover:border-accent/40"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm italic text-text hover:border-accent/40"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm underline text-text hover:border-accent/40"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => applyFormat("insertUnorderedList")}
              className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm text-text hover:border-accent/40"
            >
              • List
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="mt-3 min-h-[160px] rounded-lg border border-surface-2 bg-bg px-4 py-3 font-body text-text outline-none focus:border-accent"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save About Section"}
          </button>
        </>
      )}
    </div>
  );
}