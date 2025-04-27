import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default Express.Router()
    // this route only for user use
    .use(auth.verifyToken)
    .post("/createBooking", controller.createBooking)
    .get("/findBooking", controller.findBooking)
    .get('/getBookingList', controller.getBookingList)
    .put("/updateBooking", controller.updateBooking)