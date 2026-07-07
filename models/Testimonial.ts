import mongoose, { Schema, models, model } from "mongoose";

export interface TestimonialDocument {
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
  createdAt: Date;
}

const TestimonialSchema = new Schema<TestimonialDocument>({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial =
  models.Testimonial || model<TestimonialDocument>("Testimonial", TestimonialSchema);

export default Testimonial;