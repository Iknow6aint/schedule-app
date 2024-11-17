import express from 'express';
import { NotificationController } from '../controllers/NotificationController';

const router = express.Router();

router.get('/customers', NotificationController.getCustomers);
router.post('/send', NotificationController.sendCustomNotification);
router.get('/history', NotificationController.getNotificationHistory);

export default router;
