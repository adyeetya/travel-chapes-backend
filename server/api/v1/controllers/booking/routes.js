import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default Express.Router()
    .use(auth.verifyToken)
    .post("/createBooking", controller.createBooking)
    .get("/findBooking", controller.findBooking)
    .put("updateBooking", controller.updateBooking)