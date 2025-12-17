import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CatchAsync from "@utils/CatchAsync";
import SendResponse from "@utils/SendResponse";
import { PaymentRequestService } from "./payment-request.service";

const createPaymentRequest = CatchAsync(async (req: Request, res: Response) => {
    const result = await PaymentRequestService.createPaymentRequest(req.body);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment request received successfully!",
        data: result,
    });
});

export const PaymentRequestController = {
    createPaymentRequest,
};
