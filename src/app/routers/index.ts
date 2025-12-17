import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { QRCodeRoutes } from "../modules/QRCode/qr-code.router";
import { PaymentRequestRoutes } from "../modules/PaymentRequest/payment-request.routes";

const router = express.Router();


router.use("/auth", AuthRoutes)
router.use("/users", UserRoutes)
router.use("/qr-code", QRCodeRoutes)
router.use("/payment-request", PaymentRequestRoutes)


export default router;
