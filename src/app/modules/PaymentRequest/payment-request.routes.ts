import express from "express";
import { PaymentRequestController } from "./payment-request.controller";

const router = express.Router();

router.post("/", PaymentRequestController.createPaymentRequest);

export const PaymentRequestRoutes = router;
