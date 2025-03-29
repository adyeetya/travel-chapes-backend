import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"
import status from "../../../../enums/status";
const { userServices } = require("../../services/user");
const { createUser, findUser, updateUser } = userServices;
const commonFunction = require("../../../../helper/utlis");
const userType = require("../../../../enums/userType");
const sendMobileOtp = require("../../../../helper/mobileSms");
import { sendEmailUserQuery } from "../../../../helper/mailer";
import { userQueryServices } from "../../services/userQuery";
const { createQuery } = userQueryServices;
import jwt from "jsonwebtoken";

class userController {
  async signup(req, res, next) {
    const validSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      mobileNumber: Joi.string().required(),
    });

    try {
      const { error, value } = validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }

      const existingUser = await findUser({ $or: [{ email: value.email }, { mobileNumber: value.mobileNumber }] });
      if (existingUser) {
        if (value.email === existingUser.email) {
          throw apiError.alreadyExist(responseMessage.EMAIL_EXIST);
        } else {
          throw apiError.alreadyExist(responseMessage.MOBILE_EXIST);
        }
      }
      const otp = commonFunction.getOtp();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      const newUser = {
        name: value.name,
        email: value.email,
        mobileNumber: value.mobileNumber,
        status: status.active,
        otp,
        otpExpiresAt,
      };
      const result = await sendMobileOtp(value.mobileNumber, otp);
      if (!result) {
        throw apiError.internal(responseMessage.SOMETHINGWENT_WRONG);
      }
      await createUser(newUser);
      return res.json(new response({}, responseMessage.OTP_SEND));
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    const validSchema = Joi.object({
      mobileNumber: Joi.string().optional(),
      otp: Joi.string().required(),
    });
    try {
      const { error, value } = validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      const userResult = await findUser({ mobileNumber: value.mobileNumber, status: { $eq: status.active } });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (new Date().getTime() > new Date(userResult.otpExpiresAt).getTime()) {
        throw apiError.notAllowed(responseMessage.OTP_EXPIRED);
      }
      if (value.otp !== userResult.otp) {
        throw apiError.notAllowed(responseMessage.INVALID_OTP);
      }
      await updateUser({ _id: userResult._id }, { isMobileVerified: true });
      return res.json(new response({}, responseMessage.OTP_VERIFIED));
    } catch (error) {
      next(error);
    }
  }


  async resendOtp(req, res, next) {
    const validSchema = Joi.object({
      mobileNumber: Joi.string().optional(),
    });
    try {
      const value = await Joi.validate(req.body, validSchema); // Validate input
      const userResult = await findUser({ mobileNumber: value.mobileNumber });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const otp = commonFunction.getOtp();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      const updateFields = {
        otp: otp,
        otpExpiresAt: otpExpiresAt,
        isMobileVerified: true
      }
      await updateUser({ _id: userResult._id }, updateFields);
      await sendMobileOtp(userResult.mobileNumber, otp);  // Send OTP via SMS (assuming you have this utility)
      return res.json(new response({}, responseMessage.OTP_SEND));
    } catch (error) {
      next(error);
    }
  }


  async userLogin(req, res, next) {
    const validSchema = {
      mobileNumber: Joi.string().required(),
    };
    try {
      const value = await Joi.validate(req.body, validSchema);
      // console.log(value);
      const userResult = await findUser({ mobileNumber: value.mobileNumber, status: status.active });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (!userResult.isMobileVerified) {
        throw apiError.notAllowed(responseMessage.MOBILE_NOT_VERIFIED);
      }
      const otp = commonFunction.getOtp();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      await sendMobileOtp(userResult.mobileNumber, otp);
      await updateUser({ _id: userResult._id }, { otp: otp, otpExpiresAt: otpExpiresAt });
      return res.json(new response({}, responseMessage.OTP_SEND));
    } catch (error) {
      next(error);
    }
  }

  async verifyLoginOtp(req, res, next) {
    const validSchema = {
      mobileNumber: Joi.string().required(),
      otp: Joi.string().required()
    }
    try {
      const value = await Joi.validate(req.body, validSchema);
      const userResult = await findUser({ mobileNumber: value.mobileNumber });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (new Date().getTime() > new Date(userResult.otp_time).getTime()) {
        throw apiError.notAllowed(responseMessage.OTP_EXPIRED);
      }
      if (value.otp !== userResult.otp) {
        throw apiError.notAllowed(responseMessage.INVALID_OTP);
      }
      const token = commonFunction.getToken({ userId: userResult._id, mobileNumber: userResult.mobileNumber });
      await updateUser({ _id: userResult._id }, { isMobileVerified: true });
      const result = { name: userResult.name, email: userResult.email, mobileNumber: userResult.mobileNumber, token: token };
      return res.json(new response(result, responseMessage.USER_LOGGED));
    } catch (error) {
      next(error);
    }
  }


  async validateToken(req, res, next) {
    try {
      if (!req.headers.token) {
        return res.status(400).send({ responseCode: 400, responseMessage: 'Token required. Please provide a token.' });
      }
      jwt.verify(req.headers.token, global.gConfig.jwtsecret, async (err, result) => {
        if (err) {
          return res.status(401).send({ responseCode: 401, responseMessage: 'Unauthorized' });
        }

        const userResult = await findUser({ _id: result.userId, status: { $eq: status.active } });
        if (!userResult) {
          return res.status(404).send({ responseCode: 404, responseMessage: 'User not found' });
        }
        const obj = {
          name: userResult.name,
          mobileNumber: userResult.mobileNumber,
          email: userResult.email
        }
        return res.json(new response(obj, responseMessage.DATA_FOUND));
      });
    } catch (error) {
      next(error)
    }
  }
  async postQuery(req, res, next) {
    const validSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      query: Joi.string().required(),
    })
    try {
      const { error, value } = await validSchema.validate(req.body);
      if (error) {
        throw apiError.badRequest(error.details[0].message);
      }
      await sendEmailUserQuery("tiwarishiv7169@gmail.com", "User Query Request", value.email, value.name, value.query);
      await createQuery(value);
      return res.json(new response({}, responseMessage.QUERY_SAVED))
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
