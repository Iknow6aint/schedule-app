import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

export const NotificationController = {
  async getCustomers(_req: Request, res: Response) {
    try {
      const customers = await NotificationService.getCustomers();
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  },

  async sendCustomNotification(req: Request, res: Response) {
    const { customerIds, message, channel } = req.body;
    try {
      const notifications = await NotificationService.sendCustomNotification({
        customerIds,
        message,
        channel,
      });
      console.log(notifications);
      
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error sending custom notification:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  },

  async getNotificationHistory(_req: Request, res: Response) {
    try {
      const history = await NotificationService.getNotificationHistory();
      console.log(history);
      
      res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching notification history:', error);
      res.status(500).json({ error: 'Failed to fetch notification history' });
    }
  },
};
