"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
class UserService {
    async register(userData) {
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = new User_1.User(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        await user.save();
        return user;
    }
    async login(email, password) {
        const user = await User_1.User.findOne({ email });
        if (!user)
            throw new Error('User not found');
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error('Invalid credentials');
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    }
    async resetPassword(email) {
        const user = await User_1.User.findOne({ email });
        if (!user)
            throw new Error('User not found');
        console.log(`Password reset link sent to ${email}`);
        return true;
    }
}
exports.userService = new UserService();
//# sourceMappingURL=AuthService.js.map