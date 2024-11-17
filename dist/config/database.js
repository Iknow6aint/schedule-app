"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/app');
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map