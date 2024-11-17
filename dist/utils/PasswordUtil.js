"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.PasswordUtil = {
    hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    },
    comparePasswords(plainText, hashed) {
        return bcrypt_1.default.compare(plainText, hashed);
    },
};
//# sourceMappingURL=PasswordUtil.js.map