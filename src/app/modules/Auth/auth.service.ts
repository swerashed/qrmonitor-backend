import bcrypt from "bcryptjs";
import { Secret } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import prisma from "@utils/prisma";
import { jwtHelpers } from "@helpers/jwtHelpers";
import emailSender from "@utils/emailSender";
import config from "@config/index";
import AppError from "@middleware/AppError";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData: any = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password incorrect!");
  }

  if (!userData.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Please verify your email first!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_secret_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_secret_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET as string
    );
  } catch (error) {
    throw new Error("You are not authorized!");
  }
  //  user exists or not
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_secret_expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to DB
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      otp: otp,
      otpExpiry: otpExpiry
    } as any,
  });


  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; color: #f8fafc;">
      <div style="text-align: center; margin-bottom: 24px;">
         <h1 style="color: #6d28d9; font-size: 24px; font-weight: bold; margin: 0;">QrMonitor</h1>
      </div>
      <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; text-align: center;">
        <h2 style="color: #e2e8f0; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Hello <strong>${userData.name || "User"}</strong>,</p>
        <p style="color: #94a3b8; font-size: 15px;">
           Use the code below to reset your password. This code is valid for 10 minutes.
        </p>
        <div style="margin: 32px 0;">
           <span style="background-color: #6d28d9; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 4px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 14px;">
           Need help? Contact us at <a href="${config.CLIENT_URL}/contact" style="color: #a78bfa; text-decoration: underline;">support</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} QrMonitor. All rights reserved.</p>
      </div>
    </div>
`;

  await emailSender(
    userData.email,
    "Password Reset Code",
    `Your password reset code is: ${otp}`,
    htmlContent
  );
};

const checkResetOtp = async (payload: { email: string; otp: string }) => {
  const userData: any = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (userData.otp !== payload.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }

  if (userData.otpExpiry && new Date() > userData.otpExpiry) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired!");
  }

  return { isValid: true };
};

const resetPassword = async (
  payload: { email: string; otp: string; newPassword: string }
) => {
  const userData: any = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (userData.otp !== payload.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }

  if (userData.otpExpiry && new Date() > userData.otpExpiry) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired!");
  }

  // hash pass
  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt.salt_round)
  );

  // update into db
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    } as any,
  });
};

const verifyOtp = async (payload: { email: string; otp: string }) => {
  const userData: any = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  if (userData.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified!");
  }

  if (userData.otp !== payload.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }

  if (userData.otpExpiry && new Date() > userData.otpExpiry) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired!");
  }

  await prisma.user.update({
    where: { email: payload.email },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    } as any,
  });

  return { message: "Account verified successfully!" };
};

const resendOtp = async (payload: { email: string }) => {
  const userData: any = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  if (userData.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified!");
  }

  const now = new Date();
  const timeLimit = 5 * 60 * 1000; // 5 minutes

  let attempts = userData.resendAttempts || 0;

  if (userData.lastResendAt && now.getTime() - new Date(userData.lastResendAt).getTime() < timeLimit) {
    if (attempts >= 2) {
      throw new AppError(StatusCodes.TOO_MANY_REQUESTS, "Too many resend attempts. Please waiting 5 minutes.");
    }
    attempts += 1;
  } else {
    attempts = 1;
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { email: payload.email },
    data: {
      otp: newOtp,
      otpExpiry: otpExpiry,
      resendAttempts: attempts,
      lastResendAt: now,
    } as any,
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; color: #f8fafc;">
      <div style="text-align: center; margin-bottom: 24px;">
         <h1 style="color: #6d28d9; font-size: 24px; font-weight: bold; margin: 0;">QrMonitor</h1>
      </div>
      <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; text-align: center;">
        <h2 style="color: #e2e8f0; font-size: 20px; margin-top: 0;">Verify Your Account</h2>
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Hello <strong>${userData.name}</strong>,</p>
        <p style="color: #94a3b8; font-size: 15px;">
          Here is your new verification code. This code is valid for 10 minutes.
        </p>
        <div style="margin: 32px 0;">
          <span style="background-color: #6d28d9; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 4px; display: inline-block;">
            ${newOtp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
          If you didn't request a code, you can safely ignore this email.
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} QrMonitor. All rights reserved.</p>
      </div>
    </div>
  `;

  await import("@utils/emailSender").then((mod) => mod.default(
    userData.email,
    "New Verification Code",
    `Your OTP is ${newOtp}`,
    htmlContent
  ));

  return { message: "OTP sent successfully! Please check your email." };
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  checkResetOtp,
};
