import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
import { adminServices } from "../../services/admin";
const { findAdmin } = adminServices;
import { tripCategoryServices } from "../../services/tripCategory";
const { createTripCategory, findTripCategory, updateTripCategory, findCategoryList } = tripCategoryServices;


class tripCategoryController {
    async createTripCategory(req, res, next) {
        const validSchema = Joi.object({
            category: Joi.string().required()
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
            await createTripCategory(value);
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }

    async getTripCategoryList(req, res, next) {
        try {
            const result = await findCategoryList({ isDeleted: false });
            if (result.length === 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async updateTripCategory(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            category: Joi.string().required()
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
            const checkCategory = await findTripCategory({ _id: value._id });
            if (!checkCategory) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateTripCategory({ _id: checkCategory._id }, value);
            return res.json(new response({}, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            next(error);
        }
    }
}

export default new tripCategoryController();
