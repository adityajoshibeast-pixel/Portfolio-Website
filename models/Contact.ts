import mongoose, { Schema, models, model } from "mongoose";

export interface ContactDocument {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDocument>({
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  instagram: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = models.Contact || model<ContactDocument>("Contact", ContactSchema);

export default Contact;