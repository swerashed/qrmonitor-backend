import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { QRCodeRoutes } from "../modules/QRCode/qr-code.router";
import { PaymentRequestRoutes } from "../modules/PaymentRequest/payment-request.routes";
import { ContactRoutes } from "../modules/Contact/contact.routes";

const router = express.Router();


router.use("/auth", AuthRoutes)
router.use("/users", UserRoutes)
router.use("/qr-code", QRCodeRoutes)
router.use("/payment-request", PaymentRequestRoutes)
router.use("/contact", ContactRoutes)


export default router;
