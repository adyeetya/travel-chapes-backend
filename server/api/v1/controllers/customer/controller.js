import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import status from "../../../../enums/status";
import { adminServices } from "../../services/admin";
const { findAdmin } = adminServices;
import { tripServices } from "../../services/trip";
const { findTrip } = tripServices;
import { customerServices } from "../../services/customer";
import mongoose from "mongoose";
const {
    createCustomer,
    findCustomer,
    updateCustomer,
    findCustomerList,
    findPopulatedCustomer
} = customerServices;

class customerController {
    async createCustomer(req, res, next) {
        const validSchema = Joi.object({
            name: Joi.string().required().trim(),
            contact: Joi.string().required()
                .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/)
                .message('Please provide a valid phone number'),
            bookings: Joi.array().items(Joi.string()).optional()
        });

        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            value.createdBy = adminResult._id;
            const customer = await createCustomer(value);
            const result = await findPopulatedCustomer({ _id: customer._id });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }

    async addBookingToCustomer(req, res, next) {
        const validSchema = Joi.object({
            customerId: Joi.string().required(),
            bookingId: Joi.string().required()
        });

        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            const customer = await findCustomer({ _id: value.customerId });
            if (!customer) {
                throw apiError.notFound(responseMessage.CUSTOMER_NOT_FOUND);
            }

            const result = await updateCustomer(
                { _id: value.customerId },
                { $push: { bookings: value.bookingId } }
            );

            return res.json(new response(result, responseMessage.DATA_UPDATED));
        } catch (error) {
            next(error);
        }
    }

    async getCustomerList(req, res, next) {
        try {
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            const query = { isDeleted: { $ne: true } };
            if (req.query._id) {
                query.tripId = new mongoose.Types.ObjectId(req.query._id);
            }
            const result = await findCustomerList(query);
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async updateCustomer(req, res, next) {
        const validSchema = Joi.object({
            customerId: Joi.string().required(),
            name: Joi.string().optional().trim(),
            contact: Joi.string().optional()
                .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/)
                .message('Please provide a valid phone number'),
            bookings: Joi.array().items(Joi.string()).optional()
        });

        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            const customer = await findCustomer({ _id: value.customerId });
            if (!customer) {
                throw apiError.notFound(responseMessage.CUSTOMER_NOT_FOUND);
            }

            const result = await updateCustomer(
                { _id: value.customerId },
                value
            );

            return res.json(new response(result, responseMessage.DATA_UPDATED));
        } catch (error) {
            next(error);
        }
    }

    async deleteCustomer(req, res, next) {
        const validSchema = Joi.object({
            customerId: Joi.string().required()
        });

        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }

            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            const customer = await findCustomer({ _id: value.customerId });
            if (!customer) {
                throw apiError.notFound(responseMessage.CUSTOMER_NOT_FOUND);
            }

            await updateCustomer(
                { _id: value.customerId },
                { isDeleted: true }
            );

            return res.json(new response({}, responseMessage.DELETE_SUCCESS));
        } catch (error) {
            next(error);
        }
    }
}

export default new customerController();