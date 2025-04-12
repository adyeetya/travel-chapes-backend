import controller from "./controller";
import auth from "../../../../helper/auth";
import Express from "express";

export default Express.Router()
    .use(auth.verifyToken)
    .post("/createOrder", controller.createOrder)
    .post("/verifyPayment", controller.verifyPayment)