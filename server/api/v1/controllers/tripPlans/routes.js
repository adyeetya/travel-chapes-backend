import Express from 'express';
import controller from "./controller"
import auth from "../../../../helper/auth";
// /api/v1/tripPlans
module.exports = Express.Router()
    .get("/getWeather", controller.getWeather)
    .post("/submitForm", controller.submitTripForm)
    .get("/tripPlansList", controller.findAlltripPlans)
    .get('/getAllIds', controller.getAllIds)
    .post("/getAllTripPlans", controller.getAllTripPlans)
    .get("/viewTripPlan", controller.viewTripPlan)
    .get("/allTripPlanCategory", controller.getTriplPlanCategory)
    .use(auth.verifyToken)
    .post("/createTripPlans", controller.createTripPlans)
    .put("/updateTripPlan", controller.updateTripPlan)
    .delete("/deleteTripPlan", controller.deleteTripPlan)




// 2vc5YlrwaFaZZctcBcCnQ6PCMPn_4kJLQd9b5wAtq6A2YiSMy
