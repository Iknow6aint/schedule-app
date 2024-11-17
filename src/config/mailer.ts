import nodemailer from 'nodemailer';

export const MailService = {
  transporter: null as nodemailer.Transporter | null,

  // Initialize Ethereal SMTP
  async init() {
    if (!this.transporter) {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal Test Account:', testAccount);

      this.transporter = nodemailer.createTransport({
        host: 'buysharein.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: "support@buysharein.com", // Ethereal generated user
          pass: "nPWfA7QiBaEdmhG", // Ethereal generated password
        },
      });
    }
  },

  // Send mail
  async sendMail(to: string, subject: string, text: string, html?: string) {
    if (!this.transporter) {
      await this.init();
    }

    const mailOptions = {
      from: "support@buysharein.com", // Sender address
      to, // Receiver address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    try {
      const info = await this.transporter!.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      console.log(`Email sent: ${to}`);
     // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },
};
