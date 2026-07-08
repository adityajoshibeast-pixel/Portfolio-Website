"use client";

import { useEffect, useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadImage";

type Post = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  slug: string;
};

export default function BlogEditor() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setFile(null);
    setEditingId(null);
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const content = editorRef.current?.innerHTML || "";
      let coverImage = "";

      if (file) {
        coverImage = await uploadToCloudinary(file);
      }

      const payload = { title, excerpt, content, ...(coverImage && { coverImage }) };

      if (editingId) {
        await fetch("/api/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    if (editorRef.current) editorRef.current.innerHTML = post.content;
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">Blog Posts</h2>
      <p className="mt-1 font-body text-sm text-muted">
        Write articles that appear on your public blog page.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          required
        />
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary"
          className="w-full rounded-lg border border-surface-2 bg-bg px-4 py-2 font-body text-text outline-none focus:border-accent"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full font-body text-sm text-muted"
        />

        <div className="flex gap-2">
          <button type="button" onClick={() => applyFormat("bold")} className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm font-bold text-text hover:border-accent/40">B</button>
          <button type="button" onClick={() => applyFormat("italic")} className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm italic text-text hover:border-accent/40">I</button>
          <button type="button" onClick={() => applyFormat("insertUnorderedList")} className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-sm text-text hover:border-accent/40">List</button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[200px] rounded-lg border border-surface-2 bg-bg px-4 py-3 font-body text-text outline-none focus:border-accent"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-lg border border-surface-2 px-5 py-2 font-body text-sm text-muted hover:border-accent/40">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {posts.map((post) => (
          <div key={post._id} className="flex items-center justify-between rounded-xl border border-surface-2 bg-bg p-3">
            <p className="font-body text-sm font-medium text-text">{post.title}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(post)} className="rounded-lg border border-surface-2 px-3 py-1.5 font-body text-xs text-muted hover:border-accent/40">Edit</button>
              <button onClick={() => handleDelete(post._id)} className="rounded-lg border border-red-400/40 px-3 py-1.5 font-body text-xs text-red-400 hover:bg-red-400/10">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}