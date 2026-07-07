import mongoose, { Schema, models, model } from "mongoose";

export interface FestiveOfferDocument {
  isActive: boolean;
  title: string;
  description: string;
  discountText: string;
  updatedAt: Date;
}

const FestiveOfferSchema = new Schema<FestiveOfferDocument>({
  isActive: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  discountText: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const FestiveOffer =
  models.FestiveOffer || model<FestiveOfferDocument>("FestiveOffer", FestiveOfferSchema);

export default FestiveOffer;