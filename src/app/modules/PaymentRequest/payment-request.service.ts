import prisma from "@utils/prisma";
import { PaymentRequest } from "@prisma/client";

const createPaymentRequest = async (data: PaymentRequest) => {
    const result = await prisma.paymentRequest.create({
        data,
    });
    return result;
};

export const PaymentRequestService = {
    createPaymentRequest,
};
