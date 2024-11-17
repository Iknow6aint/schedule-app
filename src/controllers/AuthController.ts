import { Request, Response } from 'express';
import { userService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login(email, password);
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await userService.resetPassword(email);
      res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
