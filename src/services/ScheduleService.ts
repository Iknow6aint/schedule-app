import { Customer } from '../models/Customer';
import { Schedule } from '../models/Schedule';
import nodeSchedule from 'node-schedule'; // Import the scheduler
import { MailService } from '../config/mailer';

//import RedisClient from '../utils/RedisClient';

class ScheduleService {
  async create(scheduleData: {
    customerName: string;
    dispatchDate: Date;
    deliveryDate: Date;
    phone: string;
    email: string;
    notes?: string;
}) {
    // Save the schedule
    const schedule = new Schedule(scheduleData);
    await schedule.save();

    // Save customer details if not already exists
    const existingCustomer = await Customer.findOne({ email: scheduleData.email });
    if (!existingCustomer) {
        const customer = new Customer({
            name: scheduleData.customerName,
            email: scheduleData.email,
            phone: scheduleData.phone,
        });
        await customer.save();
    }

    // Send immediate notification
    await MailService.sendMail(
        scheduleData.email,
        'Dispatch Scheduled',
        `
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
        `
    );

    // Schedule reminders for 3 days before delivery date
    const deliveryDate = new Date(scheduleData.deliveryDate);
    const threeDaysBefore = new Date(deliveryDate);
    threeDaysBefore.setDate(deliveryDate.getDate() - 3);

    nodeSchedule.scheduleJob(`reminder-${schedule._id}-3-days`, threeDaysBefore, async () => {
        await MailService.sendMail(
            scheduleData.email,
            'Reminder: Dispatch Scheduled',
            `
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
            `
        );
    });

    // Schedule reminders for each day from 3 days before until the delivery date
    for (let i = 2; i >= 0; i--) {
        const reminderDate = new Date(deliveryDate);
        reminderDate.setDate(deliveryDate.getDate() - i);

        nodeSchedule.scheduleJob(`reminder-${schedule._id}-${i}-days`, reminderDate, async () => {
            await MailService.sendMail(
                scheduleData.email,
                'Reminder: Dispatch Scheduled',
                `
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
                `
            );
        });
    }

    return schedule;
}

  async getAll() {
    return Schedule.find().sort({ createdAt: -1 });
  }

  async getById(id: string) {
    const schedule = await Schedule.findById(id);
    if (!schedule) throw new Error('Schedule not found');
    return schedule;
  }

  async update(id: string, updateData: Partial<typeof Schedule>) {
    const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true });
    if (!schedule) throw new Error('Schedule not found');

    // Invalidate cache for stats
   // await RedisClient.del('scheduleStats');
    return schedule;
  }

  async delete(id: string) {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) throw new Error('Schedule not found');

    // Invalidate cache for stats
    //await RedisClient.del('scheduleStats');
    return true;
  }

  async getStats() {
  //const cachedStats = await RedisClient.get('scheduleStats');
  //f (cachedStats) return JSON.parse(cachedStats);

  const stats = {
    total: await Schedule.countDocuments(),
    active: await Schedule.countDocuments({ status: 'Active' }),
    completed: await Schedule.countDocuments({ status: 'Completed' }),
    canceled: await Schedule.countDocuments({ status: 'Canceled' }),
  };

  // Cache the stats in Redis for 1 hour
//   await RedisClient.set('scheduleStats', JSON.stringify(stats), {
//     EX: 3600, // Expire in 1 hour
//   });

  return stats;
}

}

export const scheduleService = new ScheduleService();
