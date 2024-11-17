"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService_1.userService.register(req.body);
            res.status(201).json({ message: 'User registered successfully', user });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService_1.userService.login(email, password);
            res.status(200).json({ message: 'Login successful', user, token });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email } = req.body;
            await AuthService_1.userService.resetPassword(email);
            res.status(200).json({ message: 'Password reset link sent' });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map