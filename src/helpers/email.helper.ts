import sgMail from '@sendgrid/mail';
import config from '../config';

// Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API_KEY as string);

interface EmailOptions {
    email: string;
    subject: string;
    htmlContent: string;
}

export const sendEmail = async (options: EmailOptions) => {
    const msg = {
        to: options.email,
        from: {
            email: config.emailSender.email || 'no-reply@qrmonitor.app',
            name: config.emailSender.name || 'QR Monitor',
        },
        subject: options.subject,
        html: options.htmlContent,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully using SendGrid');
        return { success: true };
    } catch (error: any) {
        console.error('Error sending email via SendGrid:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};
