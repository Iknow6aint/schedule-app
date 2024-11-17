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
      `Dear ${scheduleData.customerName}, your dispatch has been scheduled. Delivery Date: ${scheduleData.deliveryDate}`
    );

    // Schedule reminders for 3 days before delivery date
    const deliveryDate = new Date(scheduleData.deliveryDate);
    const threeDaysBefore = new Date(deliveryDate);
    threeDaysBefore.setDate(deliveryDate.getDate() - 3);

    nodeSchedule.scheduleJob(`reminder-${schedule._id}-3-days`, threeDaysBefore, async () => {
      await MailService.sendMail(
        scheduleData.email,
        'Reminder: Dispatch Scheduled',
        `Dear ${scheduleData.customerName}, this is a reminder about your dispatch scheduled for delivery on ${scheduleData.deliveryDate}.`
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
          `Dear ${scheduleData.customerName}, this is a reminder about your dispatch scheduled for delivery on ${scheduleData.deliveryDate}.`
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