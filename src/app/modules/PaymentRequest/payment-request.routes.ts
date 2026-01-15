import express from "express";
import { PaymentRequestController } from "./payment-request.controller";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

const paymentRequestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 requests per hour
    message: "Too many payment requests from this IP, please try again after an hour"
})

router.post("/", paymentRequestLimiter, PaymentRequestController.createPaymentRequest);

export const PaymentRequestRoutes = router;
