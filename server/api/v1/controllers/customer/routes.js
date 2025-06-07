import express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default express.Router()
    // this route only for admin 
    // /api/v1/customer
    .use(auth.verifyToken)
    .post("/createCustomer", controller.createCustomer)
    .post('/invoices/generate', controller.generateInvoice)
    .get('/invoices/:customerId', controller.getCustomerInvoices)
    .post("/addPayment", controller.addPayment)
    .get("/getCustomerList", controller.getcustomerList)
    .put("/updateCustomer", controller.updateCustomer)
    .delete("/deleteCustomer", controller.deleteCustomer)