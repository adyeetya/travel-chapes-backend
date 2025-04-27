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
const sendMobileOtp = require("../../../../helper/mobileSms");