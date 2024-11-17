import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class UserService {
  async register(userData: { name: string; email: string; password: string; role?: string }) {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();

    return user;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return { user, token };
  }

  async resetPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    // Mocking password reset functionality
    console.log(`Password reset link sent to ${email}`);
    return true;
  }
}

export const userService = new UserService();
