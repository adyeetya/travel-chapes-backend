import Express from 'express';
import controller from "./controller"
import uploadHandler from '../../../../helper/uploadHandler';
module.exports = Express.Router()
     .post('/loginOtp', controller.loginOtp)
     .put('/verifyLoginOtp', controller.verifyLoginOtp)
     .post('/resendOtp', controller.resendOtp)
     .use(uploadHandler.uploadFile)
     .post("/uploadFileOnS3", controller.uploadFilesOnS3)
     .post("/createLocation", controller.createLocation)
     .get("/getLocationList", controller.locationList)
     .put("/updateLocation", controller.updateLocation)
     .post("/createHotel",controller.createHotel)
     .get("/getHotelList",controller.hotelList)
     .put("/updateHotel",controller.updateHotel)
     .post("/createVehicale",controller.createVehicale)
     .get("/getVehicalList",controller.vehicaleList)
     .put("/updateVehicale",controller.updateVehicale)