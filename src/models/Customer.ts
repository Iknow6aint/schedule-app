import mongoose, { Schema, Document } from 'mongoose';

interface Customer extends Document {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const customerSchema = new Schema<Customer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Customer = mongoose.model<Customer>('Customer', customerSchema);
