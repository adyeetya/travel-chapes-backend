import Joi from "joi";
import crypto from "crypto";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
const { findUser } = userServices;
import { tripServices } from "../../services/trip";
const { findTrip } = tripServices;
import { bookingServices } from "../../services/booking";
const { findBooking, updateBooking } = bookingServices
import { paymentServices } from "../../services/payment";
const { createPayment, findPayment, updatePayment } = paymentServices;
import { createRazorpayOrder, fetchOrderDetails ,fetchPaymentDetails} from "../../../../helper/razorpay";

class paymentController {
    async createOrder(req, res, next) {
        const schema = Joi.object({
            tripId: Joi.string().required(),
            amount: Joi.number().positive().required(),
            bookingId: Joi.string().required()
        });

        try {
            const { error, value } = schema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const user = await findUser({ _id: req.userId });
            if (!user) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }

            const trip = await findTrip({ _id: value.tripId });
            if (!trip) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            const booking = await findBooking({ _id: value.bookingId });
            if (!booking) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            const razorpayOrder = await createRazorpayOrder({
                amount: value.amount,
                receipt: `receipt_${Date.now()}`,
                notes: {
                    userId: req.userId,
                    tripId: value.tripId,
                    bookingId: value.bookingId
                }
            });
            // console.log(">>>>>>>>>>", razorpayOrder);
            // const payments = await fetchOrderDetails(razorpayOrder.id);
            // console.log("payments------->",payments);


            const payment = await createPayment({
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: '',
                razorpay_transaction_id: '',
                payment_status: 'authorized',
                amount_paid: value.amount,
                currency: razorpayOrder.currency,
                payment_method: '',
                userId: req.userId,
                bookingId: value.bookingId,
                razorpay_response: razorpayOrder
            });

            return res.json(new response({
                order: razorpayOrder,
                paymentId: payment._id
            }, responseMessage.ORDER_CREATED));

        } catch (error) {
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        const schema = Joi.object({
            razorpay_payment_id: Joi.string().required(),
            razorpay_order_id: Joi.string().required(),
            razorpay_signature: Joi.string().required(),
        });

        try {
            const { error, value } = schema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const payment = await findPayment({ razorpay_order_id: value.razorpay_order_id });
            if (!payment) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            // const paymentD = await fetchOrderDetails(value.razorpay_order_id);
            // console.log(paymentD)
            // value.razorpay_payment_id = paymentD.id;
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = value;
            // const body = `razorpay_order_id=${razorpay_order_id}&razorpay_payment_id=${razorpay_payment_id}`;
            const razorpaySecret = global.gConfig.razorPay.keySecret;

            const body = `${razorpay_order_id}|${razorpay_payment_id}`;
            const generatedSignature = crypto
                .createHmac("sha256", razorpaySecret)
                .update(body.toString())
                .digest("hex");
            // console.log("generatedSignature>>>>>>>.", generatedSignature);
            // console.log("razorpay_signature>>>>>>>>>>>.", razorpay_signature);


            if (generatedSignature !== razorpay_signature) {
                throw apiError.badRequest(responseMessage.INVALID_SIGNATURE);
            }

            const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

            if (paymentDetails.status === "captured") {
                const updatedPayment = await updatePayment(
                    { razorpay_order_id: razorpay_order_id },
                    {
                        razorpay_payment_id: razorpay_payment_id,
                        payment_status: "captured",
                        razorpay_response: paymentDetails,
                        razorpay_transaction_id: paymentDetails.id,
                        payment_method: paymentDetails.method,
                        payment_date: new Date()
                    }
                );
                await updateBooking({ _id: payment.bookingId }, { paymentStatus: "paid" })
                return res.json({
                    status: "success",
                    message: responseMessage.PAYMENT_SUCCESS,
                    paymentDetails: updatedPayment,
                });
            } else {
                const updatedPayment = await updatePayment(
                    { razorpay_order_id: razorpay_order_id },
                    {
                        payment_status: "failed",
                        razorpay_response: paymentDetails,
                        razorpay_transaction_id: paymentDetails.id,
                        payment_method: paymentDetails.method,
                        payment_date: new Date()
                    }
                );
                await updateBooking({ _id: payment.bookingId }, { paymentStatus: "faild" })
                return res.json({
                    status: "failure",
                    message: responseMessage.PAYMENT_FAILED,
                    paymentDetails: updatedPayment,
                });
            }
        } catch (error) {
            next(error);
        }
    }

}

export default new paymentController();
