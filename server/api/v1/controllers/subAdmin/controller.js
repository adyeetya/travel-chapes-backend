import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
const { adminServices } = require("../../services/admin");
const { createAdmin, findAdmin, updateAdmin, findAdmins } = adminServices;
const commonFunction = require("../../../../helper/utlis");
const userType = require("../../../../enums/userType");


class subAdminController {

    async createSubAdmin(req, res, next) {
        const validSchema = Joi.object({
            email: Joi.string().required(),
            mobileNumber: Joi.string().required(),
            password: Joi.string().required(),
            adminType: Joi.string().value(userType.CONTENT, userType.SALES).required()
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const admin = await findAdmin({ _id: req.userId, adminType: userType.admin });
            if (!admin) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const adminResult = await findAdmin({ $or: [{ email: value.email, }, { mobileNumber: value.mobileNumber }] });
            if (adminResult) {
                throw apiError.notAllowed(responseMessage.EMAIL_MOBILE_EXIST);
            }
            const password = await commonFunction.createHash(value.password);
            value.hashedPassword = password;
            await createAdmin(value);
            return res.json(new response({}, responseMessage.SUBADMIN_CREATED(value.adminType)));
        } catch (error) {
            next(error);
        }
    }

    async getSubAdmin(req, res, next) {
        try {
            const admin = await findAdmin({ _id: req.userId, adminType: userType.admin });
            if (!admin) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const result = await findAdmins({ status: status.active });
            if (result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async viewSubadmin(req, res, next) {
        const validationSchema = Joi.object({
            _id: Joi.string().required()
        })
        try {
            const { error, value } = await validationSchema.validate(req.query);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const admin = await findAdmin({ _id: req.userId, adminType: userType.admin });
            if (!admin) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const result = await findAdmin({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));

        } catch (error) {
            next(error);
        }
    }

    async updateSubadmin(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            email: Joi.string().required(),
            mobileNumber: Joi.string().required(),
            password: Joi.string().required(),
            adminType: Joi.string().value(userType.CONTENT, userType.SALES).required()
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const admin = await findAdmin({ _id: req.userId, adminType: userType.admin });
            if (!admin) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const subadminResult = await findAdmin({ _id: value._id });
            if (!subadminResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateAdmin({ _id: subadminResult._id }, value);
            return res.json(new response({}, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            next(error);
        }
    }

    async deleteSubadmin(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required()
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const admin = await findAdmin({ _id: req.userId, adminType: userType.admin });
            if (!admin) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const result = await findAdmin({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateAdmin({ _id: value._id }, { status: { $set: status.delete } });
            return res.json(new response({}, responseMessage.DELETE_SUCCESS));
        } catch (error) {
            next(error);
        }
    }
}

export default new subAdminController();