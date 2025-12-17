import { z } from "zod";

const loginSchema = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
});



const forgotPasswordSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email(),
});

const resetPasswordSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  otp: z.string({ required_error: "OTP is required" }),
  newPassword: z.string({ required_error: "New Password is required" }),
});

const checkResetOtpSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  otp: z.string({ required_error: "OTP is required" }),
});

export const AuthValidation = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  checkResetOtpSchema
};
