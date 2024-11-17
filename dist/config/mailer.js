"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.MailService = {
    transporter: null,
    async init() {
        if (!this.transporter) {
            const testAccount = await nodemailer_1.default.createTestAccount();
            console.log('Ethereal Test Account:', testAccount);
            this.transporter = nodemailer_1.default.createTransport({
                host: 'buysharein.com',
                port: 587,
                secure: false,
                auth: {
                    user: "support@buysharein.com",
                    pass: "nPWfA7QiBaEdmhG",
                },
            });
        }
    },
    async sendMail(to, subject, text, html) {
        if (!this.transporter) {
            await this.init();
        }
        const mailOptions = {
            from: "support@buysharein.com",
            to,
            subject,
            text,
            html,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.messageId}`);
            console.log(`Email sent: ${to}`);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    },
};
//# sourceMappingURL=mailer.js.map