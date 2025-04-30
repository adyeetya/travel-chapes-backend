
import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
import axios from "axios";
import { userServices } from "../../services/user";
import { tripPlanServices } from "../../services/tripPlan";
import { adminServices } from "../../services/admin";
import { tripFormServices } from "../../services/tripForm";
const { findAdmin } = adminServices
const { findUser } = userServices;
const { createTripFrom } = tripFormServices
const { createTripPlans, findAlltripPlans, findTripPlans, updateTripPlans, getTripPlanCategories, getTripPlans } = tripPlanServices;

class tripPlansController {
    async findAlltripPlans(req, res, next) {
        const validSchema = Joi.object({
            page: Joi.number().optional(),
            limit: Joi.number().optional(),
        })
        try {
            const { error, value } = validSchema.validate(req.body)
            if (error) {
                throw apiError.badRequest(error.details[0].message)
            }
            const result = await findAlltripPlans(value)
            if (result.docs.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            }
            return res.json(new response(result, responseMessage.DATA_FOUND))
        } catch (error) {
            next(error)
        }
    }
    async createTripPlans(req, res, next) {
        const validSchema = Joi.object({
            slug: Joi.string().required(),

            title: Joi.string().required(),

            route: Joi.string().required(),
            duration: Joi.string().optional(),
            category: Joi.array().optional(),
            ageGroup: Joi.string().optional(),
            minPrice: Joi.string().required(),
            banners: Joi.object({
                phone: Joi.string().optional(),
                web: Joi.string().optional(),
            }).optional(),
            images: Joi.array().items(Joi.string()).optional(),
            metaTitle: Joi.string().optional(),
            metaDescription: Joi.string().optional(),
            headline: Joi.string().optional(),
            description: Joi.string().optional(),
            fullItinerary: Joi.array().items(
                Joi.object({
                    day: Joi.string().required(),
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            inclusions: Joi.array().items(
                Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            exclusions: Joi.array().items(
                Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            importantPoints: Joi.array().items(
                Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                })
            ).optional(),
        });

        try {
            console.log('req', req.body)
            const { error, value } = validSchema.validate(req.body);
            console.log('value', value)
            if (error) {
                return next(apiError.badRequest(error.details[0].message)); // Use `next` directly
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                return next(apiError.notFound(responseMessage.ADMIN_NOT_FOUND));
            }
            const checkSlug = await findTripPlans({ slug: value.slug });
            if (checkSlug) {
                throw apiError.alreadyExist(responseMessage.ALREADY_EXIST);
            }
            await createTripPlans(value);
            return res.json(new response({}, responseMessage.TRIP_PLAN_CREATED));
        } catch (err) {
            next(err);
        }
    }
    async updateTripPlan(req, res, next) {
        const updateSchema = Joi.object({
            _id: Joi.string().required(),
            slug: Joi.string().required(),
            name: Joi.string().optional(),
            title: Joi.string().optional(),
            city: Joi.string().required(),
            route: Joi.string().optional(),
            duration: Joi.string().optional(),
            category: Joi.array().optional(),
            ageGroup: Joi.string().optional(),
            minPrice: Joi.string().optional(),
            banners: Joi.object({
                phone: Joi.string().optional(),
                web: Joi.string().optional(),
            }).optional(),
            images: Joi.array().items(Joi.string()).optional(),
            metaTitle: Joi.string().optional(),
            metaDescription: Joi.string().optional(),
            headline: Joi.string().optional(),
            description: Joi.string().optional(),
            fullItinerary: Joi.array().items(
                Joi.object({
                    day: Joi.string().optional(),
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            inclusions: Joi.array().items(
                Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            exclusions: Joi.array().items(
                Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            importantPoints: Joi.array().items(
                Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                })
            ).optional(),
            status: Joi.string().valid('active', 'delete').optional(),
        });

        try {
            const { error, value } = updateSchema.validate(req.body);
            if (error) {
                return next(apiError.badRequest(error.details[0].message));
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                return next(apiError.notFound(responseMessage.ADMIN_NOT_FOUND));
            }
            const tripPlan = await findTripPlans({ _id: value._id });
            if (!tripPlan) {
                return next(apiError.notFound(responseMessage.TRIP_PLAN_NOT_FOUND));
            }

            await updateTripPlans({ _id: value._id }, value);
            return res.json(new response({}, responseMessage.TRIP_PLAN_UPDATED));
        } catch (err) {
            next(err);
        }
    }
    async viewTripPlan(req, res, next) {
        try {
            // console.log("req.query", req.query);
            const tripPlanId = req.query._id;
            const tripSlug = req.query.slug;
            const query = {};
            if (tripPlanId) {
                query._id = tripPlanId;
            } else if (tripSlug) {
                query.slug = tripSlug;
            }

            const tripPlan = await findTripPlans(query);

            if (!tripPlan) {
                return next(apiError.notFound(responseMessage.TRIP_PLAN_NOT_FOUND));
            }
            return res.json(new response(tripPlan, responseMessage.DATA_FOUND));
        } catch (err) {
            next(err);
        }
    }

    async getTriplPlanCategory(req, res, next) {
        try {
            const result = await getTripPlanCategories({ status: { $ne: status.delete } });
            if (result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async getAllTripPlans(req, res, next) {
        try {
            const validatedBody = req.body;
            const tripPlans = await findAlltripPlans(validatedBody);
            return res.json(new response(tripPlans, responseMessage.DATA_FOUND));
        } catch (err) {
            next(err);
        }
    }
    async getWeather(req, res, next) {
        const validSchema = Joi.object({
            city: Joi.string().required()
        })
        try {
            const { error, value } = validSchema.validate(req.query);
            if (error) throw apiError.badRequest(error.details[0].message);
            const city = req.query.city;
            const apiKey = global.gConfig.openWeatherKey;
            const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
            try {
                // console.log(APIUrl);
                const responseData = await axios.get(APIUrl);
                let weather = responseData.data;
                if (!weather) {
                    throw apiError.internal(responseMessage.SOMETHINGWENT_WRONG);
                }
                return res.json(new response(weather, responseMessage.DATA_FOUND))
            } catch (error) {
                console.log("error===========>", error);

                if (error) {
                    throw apiError.internal(responseMessage.SOMETHINGWENT_WRONG);
                }
            }
        } catch (error) {
            console.log("error>>>>>>>>>>", error);
            next(error);
        }
    }
    async submitTripForm(req, res, next) {
        const validSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            numberOfDays: Joi.number().required(),
            numberOfTravelers: Joi.number().required(),
            destination: Joi.string().required()
        })
        try {
            const { error, value } = validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            await createTripFrom(value);
            return res.json(new response({}, responseMessage.DATA_SAVED))
        } catch (error) {
            next(error)
        }
    }

    async getAllIds(req, res, next) {
        try {
            const result = await findAlltripPlans({
                query: {},
                projection: { slug: 1 }
            });

            if (!result.docs || result.docs.length === 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const ids = result.docs.map(trip => trip.slug.toString()); // Convert ObjectId to string

            return res.json(new response(ids, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async deleteTripPlan(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                return next(apiError.notFound(responseMessage.ADMIN_NOT_FOUND));
            }
            const tripResult = await findTripPlans({ _id: value._id });
            if (!tripResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateTripPlans({ _id: tripResult._id }, { status: { $set: status.delete } });
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }

    async getFullIntenriesBySlug(req, res, next) {
        const validSchema = Joi.object({
            slug: Joi.string().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.query);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await getTripPlans({ slug: value.slug });
            if (!result || result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
}


export default new tripPlansController()

