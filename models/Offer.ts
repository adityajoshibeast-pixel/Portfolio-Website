import mongoose, { Schema, models, model } from "mongoose";

export interface OfferDocument {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoLink?: string;
  createdAt: Date;
}

const OfferSchema = new Schema<OfferDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  demoLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Offer = models.Offer || model<OfferDocument>("Offer", OfferSchema);

export default Offer;