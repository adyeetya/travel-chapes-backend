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
}

export default new customerController()