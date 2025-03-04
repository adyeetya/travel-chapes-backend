import Express from 'express';
import controller from "./controller"
import uploadHandler from '../../../../helper/uploadHandler';
module.exports = Express.Router()
     .post('/signup', controller.signup)
     .put('/verifyOtp', controller.verifyOtp)
     .post('/resendOtp', controller.resendOtp)
     .post('/loginUser', controller.userLogin)
     .put("/verifyLoginOtp", controller.verifyLoginOtp)
     .use(uploadHandler.uploadFile)
     .post("/uploadFileOnS3", controller.uploadFilesOnS3)

