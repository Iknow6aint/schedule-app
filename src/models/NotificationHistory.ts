import mongoose, { Schema, Document, Types } from 'mongoose';

export interface NotificationDocument extends Document {
  customerId: Types.ObjectId;
  message: string;
  channel: 'email' | 'sms' | 'whatsapp';
  status: 'Pending' | 'Sent' | 'Failed';
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ['email', 'sms', 'whatsapp'], required: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<NotificationDocument>('Notification', NotificationSchema);
