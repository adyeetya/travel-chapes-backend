import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
import axios from "axios";
import { userServices } from "../../services/user";
import { tripPlanServices } from "../../services/tripPlan";
import { adminServices } from "../../services/admin";
const { findAdmin } = adminServices
const { findUser } = userServices;
import { tripServices } from "../../services/trip";
const { createTripDetails, findTrip, updateTrip, findTripList, findPopulateTrip, } = tripServices;
import { customerServices } from "../../services/customer";
const { createCustomer, findCustomer, updateCustomer, findCustomerList, findPopulatedCustomer } = customerServices
class customerController {
    async createCustomer(req, res, next) {
        const validSchema = Joi.object({
            tripId: Joi.string().required(),
            name: Joi.string().required(),
            contact: Joi.string().required(),
            agreedPrice: Joi.number().required(),
            numOfPeople: Joi.number().required(),
            // payment: Joi.object().optional()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const checkTrip = await findTrip({ _id: value.tripId });
            if (!checkTrip) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const cres = await createCustomer(value);
            const result = await findPopulatedCustomer({ _id: cres._id });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async addPayment(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            payment: Joi.object().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const checkCustomer = await findCustomer({ _id: value._id });
            if (!checkCustomer) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const result = await updateCustomer({ _id: checkCustomer._id }, { $push: { payments: value.payment } });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getcustomerList(req, res, next) {
        try {
            console.log('req:', req)
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            // Check if tripId is provided in request query
            const query = {};

            if (req.query.tripId) {
                query.tripId = req.query.tripId;
            }

            const result = await findCustomerList(query);
            if (result.length === 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateCustomer(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            tripId: Joi.string().required(),
            name: Joi.string().required(),
            contact: Joi.string().required(),
            agreedPrice: Joi.number().required(),
            numOfPeople: Joi.number().required(),
            payments: Joi.array().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            }
            const checkResult = await findCustomer({ _id: value._id });
            if (!checkResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const result = await updateCustomer({ _id: checkResult._id }, value);
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async 
}

export default new customerController()