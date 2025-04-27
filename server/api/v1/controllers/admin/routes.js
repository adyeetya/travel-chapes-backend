import Express from 'express';
import controller from "./controller"
import uploadHandler from '../../../../helper/uploadHandler';
// /api/v1/admin
module.exports = Express.Router()
     .post('/loginOtp', controller.loginOtp)
     .put('/verifyLoginOtp', controller.verifyLoginOtp)
     .post('/resendOtp', controller.resendOtp)
     .use(uploadHandler.uploadFile)
     .post("/uploadFileOnS3", controller.uploadFilesOnS3)