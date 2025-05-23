import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
const { adminServices } = require("../../services/admin");
const { findAdmin, updateAdmin } = adminServices;
import { blogServices } from "../../services/blog";
const { createBlog, findBlog, updateBlog, findBlogs } = blogServices;

class blogController {
    async createBlog(req, res, next) {
        const validSchema = Joi.object({
            title: Joi.string().optional(),
            text: Joi.string().optional(),
            image: Joi.string().optional(),
            location: Joi.string().optional(),
            destinationLink: Joi.string().optional(),
            author: Joi.string().optional(),
            isActive: Joi.boolean().optional(),
            isDelete: Joi.boolean().optional()

        })
        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            }
            await createBlog(value);
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }

    async blogsList(req, res, next) {
        try {
            const result = await findBlogs({ isDelete: false });
            // console.log("result", result);
            if (!result || result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            };
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async findBlog(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required()
        })
        try {
            const { error, value } = validSchema.validate(req.query);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await findBlog({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            text: Joi.string().optional(),
            image: Joi.string().optional()
        })
        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await findBlog({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateBlog({ _id: result._id }, value);
            return res.json(new response({}, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            next(error);
        }
    }
}

export default new blogController();