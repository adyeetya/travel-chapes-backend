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
const { createBooking, findBooking, updateBooking } = bookingServices;

class bookingController {
    async createBooking(req, res, next) {
        const validSchema = Joi.object({
            tripId: Joi.string().required(),
            noOfPepole: Joi.number().required(),
            paidAmount: Joi.number().required(),
        })
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
            const result = await createBooking(value);
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }

    }
    async findBooking(req, res, next) {
        const { bookingId } = req.params;
        try {
            const userResult =  await findUser({_id:req.userId});
            if(!userResult){
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            const booking = await findBooking({ _id: bookingId });
            if (!booking) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(booking, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async updateBooking(req, res, next) {
        const validSchema = Joi.object({
            bookingId:Joi.string().required(),
            tripId: Joi.string().optional(),
            noOfPeople: Joi.number().optional(),
            paidAmount: Joi.number().optional(),
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const userResult =  await findUser({_id:req.userId});
            if(!userResult){
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
}

export default new bookingController();