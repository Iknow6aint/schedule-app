"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotificationController_1 = require("../controllers/NotificationController");
const router = express_1.default.Router();
router.get('/customers', NotificationController_1.NotificationController.getCustomers);
router.post('/send', NotificationController_1.NotificationController.sendCustomNotification);
router.get('/history', NotificationController_1.NotificationController.getNotificationHistory);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map