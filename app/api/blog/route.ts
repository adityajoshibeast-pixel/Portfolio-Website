import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { auth } from "@/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  await connectToDatabase();
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  let slug = slugify(body.title);
  const existing = await BlogPost.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const post = await BlogPost.create({
    title: body.title,
    slug,
    excerpt: body.excerpt,
    content: body.content,
    coverImage: body.coverImage,
  });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();
  const { id, ...updateData } = body;

  const updated = await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectToDatabase();
  await BlogPost.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}