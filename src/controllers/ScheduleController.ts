import { Request, Response } from 'express';
import { scheduleService } from '../services/ScheduleService';

export class ScheduleController {
  static async create(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.create(req.body);
      res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const schedules = await scheduleService.getAll();
      res.status(200).json(schedules);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.getById(req.params.id);
      res.status(200).json(schedule);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.update(req.params.id, req.body);
      res.status(200).json({ message: 'Schedule updated successfully', schedule });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await scheduleService.delete(req.params.id);
      res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async getStats(_req: Request, res: Response) {
    try {
      const stats = await scheduleService.getStats();
      res.status(200).json(stats);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
