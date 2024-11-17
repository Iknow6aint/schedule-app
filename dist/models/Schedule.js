"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const mongoose_1 = require("mongoose");
const ScheduleSchema = new mongoose_1.Schema({
    customerName: { type: String, required: true },
    dispatchDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\+?[\d\s-]{10,}$/.test(v),
            message: 'Invalid phone number format',
        },
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /\S+@\S+\.\S+/.test(v),
            message: 'Invalid email format',
        },
    },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Completed', 'Canceled'], default: 'Active' },
}, { timestamps: true });
exports.Schedule = (0, mongoose_1.model)('Schedule', ScheduleSchema);
//# sourceMappingURL=Schedule.js.map