import emailSender from "@utils/emailSender";

const sendContactMessage = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}) => {
    const { firstName, lastName, email, message } = payload;
    const fullName = `${firstName} ${lastName}`;

    // 1. Send Notification to Admin (support@qrmonitor.com)
    const adminHtmlContent = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ccc;">
        ${message}
      </blockquote>
    </div>
  `;

    // We send this TO the support email, appearing to come FROM the user (or system on behalf of user)
    // Since we use SendGrid/SMTP, 'from' must be a verified sender.
    // The 'emailSender' util uses config.emailSender.email as 'from'.
    // We can't change 'from' dynamically to user's email if it's not verified.
    // So we send TO support@qrmonitor.com.
    await emailSender(
        "support@qrmonitor.app",
        `Contact Form: ${fullName}`,
        message,
        adminHtmlContent
    );

    // 2. Send Auto-Reply to User FROM support@qrmonitor.com
    const userHtmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
      <h2 style="color: #6d28d9;">Thanks for contacting us!</h2>
      <p>Hi ${firstName},</p>
      <p>We verify that we have received your message. Our team will review it and get back to you as soon as possible.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;"><strong>Your Message:</strong></p>
      <p style="color: #666; font-style: italic;">"${message}"</p>
    </div>
  `;

    await emailSender(
        email,
        "We received your message - QrMonitor",
        "Thanks for contacting us. We will get back to you soon.",
        userHtmlContent
    );

    return { message: "Message sent successfully" };
};

export const ContactService = {
    sendContactMessage,
};
