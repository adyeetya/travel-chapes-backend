import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
import { userServices } from "../../services/user";
import { tripPlanServices } from "../../services/tripPlan";
const { findUser } = userServices;
const { findAlltripPlans } = tripPlanServices;

class tripPlansController {
    async findAlltripPlans(req, res, next) {
        const validSchema = Joi.object({
            page: Joi.number().optional(),
            limit: Joi.number().optional(),
        })
        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            // const userResult = await findUser({ _id: req.userId });
            // if (!userResult) {
            //     throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            // }
            const result = await findAlltripPlans(value);
            if (result.docs.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            }
            return res.json(new response(result,responseMessage.DATA_FOUND))
        } catch (error) {
            next(error);
        }
    }
}

export default new tripPlansController();