import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) return null;

  return {
    title: (post as any).title,
    content: (post as any).content,
    coverImage: (post as any).coverImage,
    createdAt: (post as any).createdAt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <article className="mx-auto max-w-3xl px-6 py-20">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="mb-8 h-64 w-full rounded-2xl object-cover" />
        )}
        <p className="font-mono text-xs text-accent-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-text">{post.title}</h1>
        <div
          className="mt-8 font-body text-muted leading-relaxed [&_b]:text-text [&_strong]:text-text [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <Footer />
    </div>
  );
}