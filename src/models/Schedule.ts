import { Schema, model } from 'mongoose';

// Schedule Schema definition
const ScheduleSchema = new Schema(
  {
    customerName: { type: String, required: true },
    dispatchDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\+?[\d\s-]{10,}$/.test(v),
        message: 'Invalid phone number format',
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: 'Invalid email format',
      },
    },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Completed', 'Canceled'], default: 'Active' },
  },
  { timestamps: true }
);

export const Schedule = model('Schedule', ScheduleSchema);
