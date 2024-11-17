"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleService = void 0;
const Customer_1 = require("../models/Customer");
const Schedule_1 = require("../models/Schedule");
const node_schedule_1 = __importDefault(require("node-schedule"));
const mailer_1 = require("../config/mailer");
class ScheduleService {
    async create(scheduleData) {
        const schedule = new Schedule_1.Schedule(scheduleData);
        await schedule.save();
        const existingCustomer = await Customer_1.Customer.findOne({ email: scheduleData.email });
        if (!existingCustomer) {
            const customer = new Customer_1.Customer({
                name: scheduleData.customerName,
                email: scheduleData.email,
                phone: scheduleData.phone,
            });
            await customer.save();
        }
        await mailer_1.MailService.sendMail(scheduleData.email, 'Dispatch Scheduled', `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #333;">Hello ${scheduleData.customerName},</h2>
                    <p style="font-size: 16px; color: #555;">We are excited to inform you that your dispatch has been successfully scheduled.</p>
                    <p style="font-size: 16px; color: #555;">Delivery Date: <strong style="color: #1e90ff;">${scheduleData.deliveryDate.toLocaleDateString()}</strong></p>
                    <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out to us.</p>
                    <p style="font-size: 16px; color: #555;">Best regards,<br/>Your Company Team</p>
                </div>
            </body>
        </html>
        `);
        const deliveryDate = new Date(scheduleData.deliveryDate);
        const threeDaysBefore = new Date(deliveryDate);
        threeDaysBefore.setDate(deliveryDate.getDate() - 3);
        node_schedule_1.default.scheduleJob(`reminder-${schedule._id}-3-days`, threeDaysBefore, async () => {
            await mailer_1.MailService.sendMail(scheduleData.email, 'Reminder: Dispatch Scheduled', `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #333;">Reminder: Your Dispatch is Scheduled</h2>
                        <p style="font-size: 16px; color: #555;">Dear ${scheduleData.customerName},</p>
                        <p style="font-size: 16px; color: #555;">This is a reminder about your dispatch scheduled for delivery on <strong style="color: #1e90ff;">${scheduleData.deliveryDate.toLocaleDateString()}</strong>.</p>
                        <p style="font-size: 16px; color: #555;">If you have any questions, don't hesitate to reach out to us.</p>
                        <p style="font-size: 16px; color: #555;">Best regards,<br/>Your Company Team</p>
                    </div>
                </body>
            </html>
            `);
        });
        for (let i = 2; i >= 0; i--) {
            const reminderDate = new Date(deliveryDate);
            reminderDate.setDate(deliveryDate.getDate() - i);
            node_schedule_1.default.scheduleJob(`reminder-${schedule._id}-${i}-days`, reminderDate, async () => {
                await mailer_1.MailService.sendMail(scheduleData.email, 'Reminder: Dispatch Scheduled', `
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #333;">Reminder: Your Dispatch is Scheduled</h2>
                            <p style="font-size: 16px; color: #555;">Dear ${scheduleData.customerName},</p>
                            <p style="font-size: 16px; color: #555;">This is a reminder about your dispatch scheduled for delivery on <strong style="color: #1e90ff;">${scheduleData.deliveryDate.toLocaleDateString()}</strong>.</p>
                            <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out to us.</p>
                            <p style="font-size: 16px; color: #555;">Best regards,<br/>Your Company Team</p>
                        </div>
                    </body>
                </html>
                `);
            });
        }
        return schedule;
    }
    async getAll() {
        return Schedule_1.Schedule.find().sort({ createdAt: -1 });
    }
    async getById(id) {
        const schedule = await Schedule_1.Schedule.findById(id);
        if (!schedule)
            throw new Error('Schedule not found');
        return schedule;
    }
    async update(id, updateData) {
        const schedule = await Schedule_1.Schedule.findByIdAndUpdate(id, updateData, { new: true });
        if (!schedule)
            throw new Error('Schedule not found');
        return schedule;
    }
    async delete(id) {
        const schedule = await Schedule_1.Schedule.findByIdAndDelete(id);
        if (!schedule)
            throw new Error('Schedule not found');
        return true;
    }
    async getStats() {
        const stats = {
            total: await Schedule_1.Schedule.countDocuments(),
            active: await Schedule_1.Schedule.countDocuments({ status: 'Active' }),
            completed: await Schedule_1.Schedule.countDocuments({ status: 'Completed' }),
            canceled: await Schedule_1.Schedule.countDocuments({ status: 'Canceled' }),
        };
        return stats;
    }
}
exports.scheduleService = new ScheduleService();
//# sourceMappingURL=ScheduleService.js.map