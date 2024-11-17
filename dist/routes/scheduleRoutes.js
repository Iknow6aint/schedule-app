"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ScheduleController_1 = require("../controllers/ScheduleController");
const router = (0, express_1.Router)();
router.post('/', ScheduleController_1.ScheduleController.create);
router.get('/', ScheduleController_1.ScheduleController.getAll);
router.get('/stats', ScheduleController_1.ScheduleController.getStats);
router.get('/:id', ScheduleController_1.ScheduleController.getById);
router.put('/:id', ScheduleController_1.ScheduleController.update);
router.delete('/:id', ScheduleController_1.ScheduleController.delete);
exports.default = router;
//# sourceMappingURL=scheduleRoutes.js.map