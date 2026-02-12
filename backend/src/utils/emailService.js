import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, 
      family: 4,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 60000, 
      greetingTimeout: 30000,   
      socketTimeout: 120000,
    });
  }
  return transporter;
};


export const sendInvoiceEmail = async ({ 
  to, 
  subject, 
  message, 
  pdfBuffer, 
  pdfFilename = 'invoice.pdf',
  sendCopy = false,
  copyTo = null 
}) => {
  const transporter = getTransporter();

  const htmlMessage = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">InvoicePro</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; white-space: pre-line;">${message}</p>
        ${pdfBuffer ? `
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          📎 Invoice PDF attached
        </p>
        ` : ''}
      </div>
      <div style="background: #f9fafb; padding: 15px 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
          Sent via InvoicePro • Professional Invoice Management
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html: htmlMessage,
    attachments: pdfBuffer ? [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }
    ] : [],
  };

  const result = await transporter.sendMail(mailOptions);

  if (sendCopy && copyTo) {
    await transporter.sendMail({
      ...mailOptions,
      to: copyTo,
      subject: `[Copy] ${subject}`,
    });
  }

  return result;
};


export const verifyEmailConnection = async () => {
  const transporter = getTransporter();
  return transporter.verify();
};
