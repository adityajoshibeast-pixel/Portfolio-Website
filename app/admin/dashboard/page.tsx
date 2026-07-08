"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import AboutEditor from "@/components/AboutEditor";
import ContactEditor from "@/components/ContactEditor";
import ResumeEditor from "@/components/ResumeEditor";
import TestimonialsEditor from "@/components/TestimonialsEditor";
import FestiveOfferEditor from "@/components/FestiveOfferEditor";
import BlogEditor from "@/components/BlogEditor";
import { uploadToCloudinary } from "@/lib/uploadImage";

type Offer = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoLink?: string;
};

export default function Dashboard() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchOffers = async () => {
    const res = await fetch("/api/offers");
    const data = await res.json();
    setOffers(data);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setDemoLink("");
    setFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const payload = {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        demoLink,
        ...(imageUrl && { imageUrl }),
      };

      if (editingId) {
        await fetch("/api/offers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      fetchOffers();
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer._id);
    setTitle(offer.title);
    setDescription(offer.description);
    setTags(offer.tags.join(", "));
    setDemoLink(offer.demoLink || "");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/offers?id=${id}`, { method: "DELETE" });
    fetchOffers();
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-text">
            Admin Dashboard
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="rounded-lg border border-surface-2 px-4 py-2 font-body text-sm text-muted hover:border-accent/40"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8">
          <AboutEditor />
        </div>

        <div className="mt-8">
          <ContactEditor />
        </div>

        <div className="mt-8">
          <ResumeEditor />
        </div>

        <div className="mt-8">
          <TestimonialsEditor />
        </div>

        <div className="mt-8">
          <FestiveOfferEditor />
        </div>

        <div className="mt-8">
          <BlogEditor />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-surface-2 bg-surface p-6"
        >
          <h2 className="font-display text-lg font-semibold text-text">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>

          <div>
            <label className="font-body text-sm text-muted">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, MongoDB, AI"
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">
              Demo Link (optional)
            </label>
            <input
              type="url"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="font-body text-sm text-muted">
              Image {editingId && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full font-body text-sm text-muted"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Saving..." : editingId ? "Update Project" : "Add Project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-surface-2 px-5 py-2 font-body text-sm text-muted hover:border-accent/40"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold text-text">
            Existing Projects
          </h2>

          {offers.length === 0 && (
            <p className="font-body text-sm text-muted">No projects yet.</p>
          )}

          {offers.map((offer) => (
            <div
              key={offer._id}
              className="flex items-center justify-between rounded-xl border border-surface-2 bg-surface p-4"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-text">
                  {offer.title}
                </h3>
                <p className="mt-1 font-body text-sm text-muted">
                  {offer.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-xs text-muted hover:border-accent/40"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="rounded-lg border border-red-400/40 px-3 py-1.5 font-body text-xs text-red-400 hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}