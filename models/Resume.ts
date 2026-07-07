import mongoose, { Schema, models, model } from "mongoose";

export interface ResumeDocument {
  url: string;
  updatedAt: Date;
}

const ResumeSchema = new Schema<ResumeDocument>({
  url: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Resume = models.Resume || model<ResumeDocument>("Resume", ResumeSchema);

export default Resume;