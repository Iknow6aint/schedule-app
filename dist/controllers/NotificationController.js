"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
exports.NotificationController = {
    async getCustomers(_req, res) {
        try {
            const customers = await NotificationService_1.NotificationService.getCustomers();
            res.status(200).json(customers);
        }
        catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Failed to fetch customers' });
        }
    },
    async sendCustomNotification(req, res) {
        const { customerIds, message, channel } = req.body;
        try {
            const notifications = await NotificationService_1.NotificationService.sendCustomNotification({
                customerIds,
                message,
                channel,
            });
            console.log(notifications);
            res.status(200).json(notifications);
        }
        catch (error) {
            console.error('Error sending custom notification:', error);
            res.status(500).json({ error: 'Failed to send notifications' });
        }
    },
    async getNotificationHistory(_req, res) {
        try {
            const history = await NotificationService_1.NotificationService.getNotificationHistory();
            console.log(history);
            res.status(200).json(history);
        }
        catch (error) {
            console.error('Error fetching notification history:', error);
            res.status(500).json({ error: 'Failed to fetch notification history' });
        }
    },
};
//# sourceMappingURL=NotificationController.js.map