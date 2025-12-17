import express from "express";
import { ContactController } from "./contact.controller";

const router = express.Router();

router.post("/send-message", ContactController.sendMessage);

export const ContactRoutes = router;
