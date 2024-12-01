import Express from 'express';
import controller from "./controller"
import auth from "../../../../helper/auth";
module.exports = Express.Router()
    .use(auth.verifyToken)
    .get("/tripPlansList", controller.findAlltripPlans)
    .post("/createTripPlans", controller.createTripPlans)
    .put("/updateTripPlan", controller.updateTripPlan)
    .get("/getAllTripPlans", controller.getAllTripPlans)
    .get("/viewTripPlan", controller.viewTripPlan)