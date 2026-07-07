import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import Footer from "@/components/Footer";
export const dynamic = "force-dynamic";

async function getPosts() {
  await connectToDatabase();
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();

  return posts.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    createdAt: p.createdAt,
  }));
}

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="font-display text-3xl font-semibold text-text">Blog</h1>
        <p className="mt-2 font-body text-muted">Thoughts, notes, and things I've learned.</p>

        {posts.length === 0 ? (
          <p className="mt-8 font-body text-sm text-muted">No posts yet — check back soon.</p>
        ) : (
          <div className="mt-10 space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block rounded-2xl border border-surface-2 bg-surface p-6 transition-colors hover:border-accent/40"
              >
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="mb-4 h-48 w-full rounded-xl object-cover" />
                )}
                <h2 className="font-display text-xl font-semibold text-text">{post.title}</h2>
                <p className="mt-2 font-body text-sm text-muted">{post.excerpt}</p>
                <p className="mt-3 font-mono text-xs text-accent-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}