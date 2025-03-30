import Express from 'express';
import controller from "./controller"
// /api/v1/user
module.exports = Express.Router()
     .post('/signup', controller.signup)
     .put('/verifyOtp', controller.verifyOtp)
     .post('/resendOtp', controller.resendOtp)
     .post('/loginUser', controller.userLogin)
     .put("/verifyLoginOtp", controller.verifyLoginOtp)
     .get("/validateToken", controller.validateToken)
     .post("/postQuery", controller.postQuery)