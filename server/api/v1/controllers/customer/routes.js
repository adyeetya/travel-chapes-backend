import express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default express.Router()
// /api/v1/customer
    .use(auth.verifyToken)
    .post("/createCustomer", controller.createCustomer)
    .post("/addPayment", controller.addPayment)
    .get("/getCustomerList", controller.getcustomerList)