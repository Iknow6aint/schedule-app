import { Customer } from '../models/Customer';
import { Notification } from '../models/NotificationHistory';
import { MailService } from '../config/mailer';

export const NotificationService = {
  async getCustomers() {
    return Customer.find();
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
        // Standardized HTML Email Template with Colors and Styling
        const emailSubject = 'Custom Notification - Action Required';
const emailContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4CAF50;
          font-size: 24px;
          text-align: center;
        }
        .message {
          font-size: 16px;
          line-height: 1.5;
          margin-top: 10px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
        .btn {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
          text-align: center;
        }
        .btn:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Dear ${name},</h1>
        <p class="message">${data.message}</p> <!-- Dynamically insert the message here -->
        <a href="#" class="btn">Take Action</a>
        <div class="footer">
          <p>If you have any questions, please contact us.</p>
          <p>Best regards, <br /> The DeliveryReminder Team</p>
        </div>
      </div>
    </body>
  </html>
`;

await MailService.sendMail(email, emailSubject, '', emailContent); // Send only HTML content

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
