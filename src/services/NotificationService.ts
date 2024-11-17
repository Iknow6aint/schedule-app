import { Customer } from '../models/Customer';
import { Notification } from '../models/NotificationHistory';
import { MailService } from '../config/mailer';

export const NotificationService = {
  async getCustomers() {
    return Customer.find({}, { name: 1, email: 1, phone: 1 });
  },

  async sendCustomNotification(data: {
    customerIds: string[];
    message: string;
    channel: 'email' | 'sms' | 'whatsapp';
  }) {
    const customers = await Customer.find({ _id: { $in: data.customerIds } });

    const notifications = customers.map((customer) => ({
      customerId: customer._id,
      message: data.message,
      channel: data.channel,
      status: 'Pending',
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Send notifications based on the channel
    for (const customer of customers) {
      const { email, phone, name } = customer;
      switch (data.channel) {
        case 'email':
          await MailService.sendMail(
            email,
            'Custom Notification',
            `Dear ${name}, ${data.message}`
          );
          break;
        case 'sms':
          console.log(`Sending SMS to ${phone}: ${data.message}`);
          break;
        case 'whatsapp':
          console.log(`Sending WhatsApp to ${phone}: ${data.message}`);
          break;
      }
    }

    // Update notification statuses to 'Sent'
    for (const notification of createdNotifications) {
      notification.status = 'Sent';
      await notification.save();
    }

    return createdNotifications;
  },

  async getNotificationHistory() {
    
    return Notification.find().sort({ createdAt: -1 })
    ;
  },
};
