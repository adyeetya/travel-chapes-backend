import Express from 'express';
import controller from "./controller"
module.exports = Express.Router()
     .post('/signup', controller.signup)
     .put('/verifyOtp', controller.verifyOtp)
     .post('/resendOtp', controller.resendOtp)
     .post('/loginUser', controller.userLogin)
     .put("/verifyLoginOtp",controller.verifyLoginOtp)
     .post('/forgetPassword', controller.forgetPassword)
     .put('/resetPassword', controller.resetPassword)