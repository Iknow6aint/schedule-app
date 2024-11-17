"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const Customer_1 = require("../models/Customer");
const NotificationHistory_1 = require("../models/NotificationHistory");
const mailer_1 = require("../config/mailer");
exports.NotificationService = {
    async getCustomers() {
        return Customer_1.Customer.find();
    },
    async sendCustomNotification(data) {
        const customers = await Customer_1.Customer.find({ _id: { $in: data.customerIds } });
        const notifications = customers.map((customer) => ({
            customerId: customer._id,
            message: data.message,
            channel: data.channel,
            status: 'Pending',
        }));
        const createdNotifications = await NotificationHistory_1.Notification.insertMany(notifications);
        for (const customer of customers) {
            const { email, phone, name } = customer;
            switch (data.channel) {
                case 'email':
                    await mailer_1.MailService.sendMail(email, 'Custom Notification', `Dear ${name}, ${data.message}`);
                    break;
                case 'sms':
                    console.log(`Sending SMS to ${phone}: ${data.message}`);
                    break;
                case 'whatsapp':
                    console.log(`Sending WhatsApp to ${phone}: ${data.message}`);
                    break;
            }
        }
        for (const notification of createdNotifications) {
            notification.status = 'Sent';
            await notification.save();
        }
        return createdNotifications;
    },
    async getNotificationHistory() {
        return NotificationHistory_1.Notification.find().sort({ createdAt: -1 });
    },
};
//# sourceMappingURL=NotificationService.js.map