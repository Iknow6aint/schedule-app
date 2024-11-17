import nodemailer from 'nodemailer';
import dns from 'dns/promises';

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


async sendMail(to: string, subject: string, text: string, html?: string) {
  if (!this.transporter) {
    await this.init();
  }

  // Validate email address before sending
  const isEmailValid = await this.validateEmail(to);
  if (!isEmailValid) {
    console.error(`Invalid or non-existing email address: ${to}`);
    return;
  }

  const mailOptions = {
    from: "support@buysharein.com", // Sender address
    to, // Receiver address
    subject, // Subject line
    text, // Plain text body (for clients that don't support HTML)
    html, // HTML body (optional, this is what you'll want to use)
  };

  try {
    const info = await this.transporter!.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
},

 async validateEmail(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) {
    console.error('Invalid email format: missing domain.');
    return false;
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      console.log(`Domain ${domain} has valid MX records.`);
      return true;
    }
    console.error(`No MX records found for domain: ${domain}`);
  } catch (error) {
    console.error(`Error validating domain ${domain}:`, error);
  }

  return false;
}


};
