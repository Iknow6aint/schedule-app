"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
exports.JWTUtil = {
    signToken(payload, expiresIn = '1h') {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
    },
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (typeof decoded === 'object') {
                return decoded;
            }
            return null;
        }
        catch (err) {
            console.error('Invalid token:', err);
            return null;
        }
    },
};
//# sourceMappingURL=JWTUtil.js.map