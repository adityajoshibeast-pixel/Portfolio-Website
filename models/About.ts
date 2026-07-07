import mongoose, { Schema, models, model } from "mongoose";

export interface AboutDocument {
  content: string;
  imageUrl?: string;
  updatedAt: Date;
}

const AboutSchema = new Schema<AboutDocument>({
  content: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const About = models.About || model<AboutDocument>("About", AboutSchema);

export default About;