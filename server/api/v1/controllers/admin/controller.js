import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
const { adminServices } = require("../../services/admin");
const { findAdmin, updateAdmin } = adminServices;
const commonFunction = require("../../../../helper/utlis");
const userType = require("../../../../enums/userType");
const { loginEmailOTP } = require("../../../../helper/mailer");
import { uploadFileToS3 } from "../../../../helper/aws_uploads";
import { locationServices } from "../../services/location";
const { createLocation, findLocation, updateLocation, findLocationList } = locationServices;
import { hotelServices } from "../../services/hotel";
const { createHotel, findHotel, updateHotel, findHotelList } = hotelServices;
import { vehicalServices } from "../../services/vehicale";
const { createVehicale, findVehicale, updateVehicale, findVehicaleList } = vehicalServices;
class adminController {
    async loginOtp(req, res, next) {
        const validationSchema = {
            email: Joi.string().required(),
            password: Joi.string().required()
        };
        try {
            let { email, password } = await Joi.validate(req.body, validationSchema);
            email = email.toLowerCase();
            let query = { $and: [{ adminType: { $in: [userType.admin, userType.subAdmin] } }, { email: { $regex: new RegExp("^" + email + "$", "i") } }, { status: { $eq: status.active } }] }
            const adminResult = await findAdmin(query);
            if (!adminResult) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            }
            if (!commonFunction.compareHash(password, adminResult.hashedPassword)) {
                throw apiError.invalid(responseMessage.INCORRECT_PASSWORD);
            }
            const otp = commonFunction.getOtp();
            console.log('otp sent - ', otp)
            // loginEmailOTP(email, 'Login OTP', otp);
            await updateAdmin({ _id: adminResult._id }, { otp: otp, otpTime: new Date(new Date().setMinutes(new Date().getMinutes() + 3)), isEmailVerified: false });
            return res.json(new response({}, responseMessage.OTP_SEND));
        } catch (error) {
            console.log("errom from loginOtp api===>>", error);
            return next(error);
        }
    }
    async resendOtp(req, res, next) {
        var validationSchema = {
            email: Joi.string().required(),
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            let { email } = validatedBody;
            email = email.toLowerCase();
            var userResult = await findAdmin({ email: new RegExp("^" + email + "$", "i") })
            if (!userResult) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            }
            const otp = commonFunction.getOtp();
            loginEmailOTP(email, 'Resend OTP', otp);
            await updateAdmin({ _id: userResult._id }, { otp: otp, otpTime: new Date(new Date().setMinutes(new Date().getMinutes() + 3)), isEmailVerified: false });
            return res.json(new response({}, responseMessage.OTP_SENT_EMAIL));
        }
        catch (error) {
            console.log("catch err===>>", error);
            return next(error);
        }
    }
    async verifyLoginOtp(req, res, next) {
        const validationSchema = {
            email: Joi.string().required(),
            otp: Joi.number().required(),
        };
        try {
            let { email, otp, } = await Joi.validate(req.body, validationSchema);
            email = email.toLowerCase();
            const adminResult = await findAdmin({ email: { $regex: new RegExp("^" + email + "$", "i") }, status: { $eq: status.active } })
            if (!adminResult) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            }
            // console.log('admin result ---', adminResult)
            if (Number(adminResult.otp) === Number(otp)) {
                if (new Date(adminResult.otpTime).toISOString() < new Date().toISOString()) {
                    console.log('otp matched')
                    throw apiError.notAllowed(responseMessage.OTP_EXPIRED);
                }
                await updateAdmin({ _id: adminResult._id }, { otp: null, isEmailVerified: true });
                console.log('admin updated');

            } else {
                throw apiError.notAllowed(responseMessage.INVALID_OTP);
            }
            let token = await commonFunction.getToken({ userId: adminResult._id, email: adminResult.email, adminType: adminResult.adminType });

            console.log('token sent', token);
            return res.json(new response({ token }, responseMessage.ADMIN_LOGGEDIN))


        }
        catch (error) {
            console.log("errof form login===>>", error);
            return next(error);
        }
    }
    async uploadFilesOnS3(req, res, next) {
        try {
            // console.log(req);

            const file = req.files;
            // console.log(file);
            const buketName = 'travelchapes';
            const key = req.body.keyId;
            const result = await uploadFileToS3(file[0].path, buketName, key, file[0].filename);
            if (!result) {
                throw apiError.internal(responseMessage.SOMETHINGWENT_WRONG);
            }
            return res.json(new response(result, responseMessage.UPLOAD_SUCCESS));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createLocation(req, res, next) {
        const validSchema = Joi.object({
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            description: Joi.string().optional()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            await createLocation(value);
            return res.json(new response({}, responseMessage.LOCATION_CREATED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async locationList(req, res, next) {
        try {
            const result = await findLocationList({});
            if (result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response({}, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    async updateLocation(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            description: Joi.string().optional()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await findLocation({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateLocation(value, { _id: result._id });
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }
    async createHotel(req, res, next) {
        const validSchema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            locationId: Joi.string().required(),
            rating: Joi.number().min(0).max(5).required(),
            contact: Joi.string().required()
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const checkLocation = await findLocation({ _id: value._id });
            if (!checkLocation) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await createHotel(value);
            return res.json(new response({}, responseMessage.HOTEL_CREATED));
        } catch (error) {
            next(error);
        }
    }

    async hotelList(req, res, next) {
        try {
            const result = await findHotelList({});
            if (result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async updateHotel(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            address: Joi.string().required(),
            locationId: Joi.string().required(),
            rating: Joi.number().min(0).max(5).required(),
            contact: Joi.string().required()
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await findHotel({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const checkLocation = await findLocation({ _id: value._id });
            if (!checkLocation) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateHotel({ _id: result._id }, value);
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }
    async createVehicale(req, res, next) {
        const validSchema = Joi.object({
            name: Joi.string().required(),
            maxPeople: Joi.number().required(),
            type: Joi.string().required(),
            contact: Joi.string().required(),
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            await createVehicale(value);
            return res.json(new response({}, responseMessage.VEHICLE_CREATED));
        } catch (error) {
            next(error);
        }
    }

    async vehicaleList(req, res, next) {
        try {
            const result = await findVehicaleList({});
            if (result.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    async updateVehicale(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            maxPeople: Joi.number().required(),
            type: Joi.string().required(),
            contact: Joi.string().required(),
        });
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const result = await findVehicale({ _id: value._id });
            if (!result) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateVehicale({ _id: result._id }, value);
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {
            next(error);
        }
    }
}


export default new adminController();