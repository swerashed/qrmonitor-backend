import prisma from "@utils/prisma";
import { PaymentRequest } from "@prisma/client";
import { sendEmail } from "@helpers/email.helper";
import config from "@config/index";

const createPaymentRequest = async (data: PaymentRequest) => {
  const result = await prisma.paymentRequest.create({
    data,
  });

  const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
           <h1 style="color: #6d28d9; font-size: 24px; font-weight: bold; margin: 0;">QrMonitor</h1>
        </div>
        <div style="background-color: #1e293b; padding: 24px; border-radius: 8px;">
          <h2 style="color: #e2e8f0; font-size: 20px; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 12px;">New Payment Request</h2>
          <div style="margin-top: 16px;">
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Phone:</strong> ${data.phone || 'N/A'}</p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Company:</strong> ${data.company || 'N/A'}</p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Plan:</strong> <span style="color: #6d28d9; font-weight: bold;">${data.plan}</span></p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

  // Send email to Admin
  await sendEmail({
    email: config.adminEmail,
    subject: `New Payment Request - ${data.plan}`,
    htmlContent: adminHtml
  });

  const userHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
           <h1 style="color: #6d28d9; font-size: 24px; font-weight: bold; margin: 0;">QrMonitor</h1>
        </div>
        <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; text-align: center;">
          <h2 style="color: #e2e8f0; font-size: 20px; margin-top: 0;">Payment Request Received</h2>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Dear <strong>${data.firstName}</strong>,</p>
          <p style="color: #94a3b8; font-size: 15px;">
            Thank you for choosing <strong>QrMonitor</strong>. We have received your request for the <strong style="color: #a78bfa;">${data.plan}</strong> plan.
          </p>
          <p style="color: #94a3b8; font-size: 15px;">
            Our team will review your details and contact you shortly with the next steps.
          </p>
          <div style="margin-top: 32px; border-top: 1px solid #334155; padding-top: 16px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Best regards,</p>
            <p style="color: #e2e8f0; font-weight: bold; margin: 4px 0;">QrMonitor Team</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
           <p>&copy; ${new Date().getFullYear()} QrMonitor. All rights reserved.</p>
        </div>
      </div>
    `;

  // Send email to User
  await sendEmail({
    email: data.email,
    subject: "We've received your payment request",
    htmlContent: userHtml
  });

  return result;
};

export const PaymentRequestService = {
  createPaymentRequest,
};
