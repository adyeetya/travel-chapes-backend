import Express from 'express';
import controller from "./controller"
module.exports = Express.Router()
     .post('/loginOtp', controller.loginOtp)
     .put('/verifyLoginOtp', controller.verifyLoginOtp)
     .post('/resendOtp', controller.resendOtp)