import mongoose, { Schema, models, model } from "mongoose";

export interface BlogPostDocument {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  createdAt: Date;
}

const BlogPostSchema = new Schema<BlogPostDocument>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = models.BlogPost || model<BlogPostDocument>("BlogPost", BlogPostSchema);

export default BlogPost;