import Express from 'express';
import controller from "./controller"
import auth from "../../../../helper/auth";
module.exports = Express.Router()
    .use(auth.verifyToken)
    .get("/tripPlansList", controller.findAlltripPlans)
    