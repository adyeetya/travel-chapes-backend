import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
import axios from "axios";
import { userServices } from "../../services/user";
const { findUser } = userServices;
import { tripServices } from "../../services/trip";
const { findTrip } = tripServices;
import { bookingServices } from "../../services/booking";
const { createBooking, findBooking, updateBooking, findBookingList, addPaymentToBooking } = bookingServices;

class bookingController {
    async createBooking(req, res, next) {
        const validSchema = Joi.object({
            tripId: Joi.string().required(),
            noOfPeople: Joi.number().required(),
            agreedPrice: Joi.number().required().min(0),
            payments: Joi.array().items(
                Joi.object({
                    amount: Joi.number().required(),
                    method: Joi.string().valid("cash", "online").required(),
                    transactionId: Joi.string().allow("").optional(),
                    receiver: Joi.string().allow("").optional(),
                    status: Joi.string().valid("pending", "paid", "failed").default("pending")
                })
            ).optional()
        });
        
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            
            const userResult = await findUser({ _id: req.userId });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            
            const tripResult = await findTrip({ _id: value.tripId });
            if (!tripResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            
            // Add userId to the booking
            const bookingData = {
                ...value,
                userId: req.userId
            };
            
            const result = await createBooking(bookingData);
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }

    async findBooking(req, res, next) {
        const { bookingId } = req.params;
        try {
            const userResult = await findUser({ _id: req.userId });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            
            const booking = await findBooking({ _id: bookingId })
                .populate('userId', 'name email')
                .populate('tripId', 'name destination');
                
            if (!booking) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            
            return res.json(new response(booking, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async getBookingList(req, res, next) {
        try {
            const userResult = await findUser({ _id: req.userId });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }

            const query = { 
                isDeleted: { $ne: true },
                ...(req.query.tripId && { tripId: req.query.tripId }),
                ...(req.query.userId && { userId: req.query.userId })
            };

            const bookings = await findBookingList(query)
                .populate('userId', 'name email contact')
                .populate('tripId', 'name destination startDate endDate')
                .sort({ createdAt: -1 });

            return res.json(new response(bookings, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async updateBooking(req, res, next) {
        const validSchema = Joi.object({
            bookingId: Joi.string().required(),
            tripId: Joi.string().optional(),
            agreedPrice: Joi.number().optional().min(0),
            noOfPeople: Joi.number().optional(),
            isDeleted: Joi.boolean().optional()
        });
        
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            
            const userResult = await findUser({ _id: req.userId });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            
            const booking = await findBooking({ _id: value.bookingId });
            if (!booking) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            
            const updatedBooking = await updateBooking({ _id: booking._id }, value);
            return res.json(new response(updatedBooking, responseMessage.DATA_UPDATED));
        } catch (error) {
            next(error);
        }
    }

    async addPayment(req, res, next) {
        const validSchema = Joi.object({
            bookingId: Joi.string().required(),
            amount: Joi.number().required(),
            method: Joi.string().valid("cash", "online").required(),
            transactionId: Joi.string().allow("").optional(),
            receiver: Joi.string().allow("").optional(),
            status: Joi.string().valid("pending", "paid", "failed").default("paid")
        });
        
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            
            const userResult = await findUser({ _id: req.userId });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            
            const booking = await findBooking({ _id: value.bookingId });
            if (!booking) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            
            const paymentData = {
                amount: value.amount,
                method: value.method,
                transactionId: value.transactionId,
                receiver: value.receiver,
                status: value.status,
                date: new Date()
            };
            
            const updatedBooking = await addPaymentToBooking(value.bookingId, paymentData);
            return res.json(new response(updatedBooking, responseMessage.PAYMENT_ADDED));
        } catch (error) {
            next(error);
        }
    }
}


export default new bookingController();