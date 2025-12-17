import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CatchAsync from "@utils/CatchAsync";
import SendResponse from "@utils/SendResponse";
import { ContactService } from "./contact.service";

const sendMessage = CatchAsync(async (req: Request, res: Response) => {
    const result = await ContactService.sendContactMessage(req.body);

    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

export const ContactController = {
    sendMessage,
};
