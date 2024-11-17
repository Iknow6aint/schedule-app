"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const ScheduleService_1 = require("../services/ScheduleService");
class ScheduleController {
    static async create(req, res) {
        try {
            const schedule = await ScheduleService_1.scheduleService.create(req.body);
            res.status(201).json({ message: 'Schedule created successfully', schedule });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async getAll(_req, res) {
        try {
            const schedules = await ScheduleService_1.scheduleService.getAll();
            res.status(200).json(schedules);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async getById(req, res) {
        try {
            const schedule = await ScheduleService_1.scheduleService.getById(req.params.id);
            res.status(200).json(schedule);
        }
        catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
    static async update(req, res) {
        try {
            const schedule = await ScheduleService_1.scheduleService.update(req.params.id, req.body);
            res.status(200).json({ message: 'Schedule updated successfully', schedule });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async delete(req, res) {
        try {
            await ScheduleService_1.scheduleService.delete(req.params.id);
            res.status(200).json({ message: 'Schedule deleted successfully' });
        }
        catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
    static async getStats(_req, res) {
        try {
            const stats = await ScheduleService_1.scheduleService.getStats();
            res.status(200).json(stats);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=ScheduleController.js.map