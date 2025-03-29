import Express from 'express';
import controller from "./controller"
import auth from "../../../../helper/auth";
module.exports = Express.Router()
    .get("/getWeather", controller.getWeather)
    .post("/submitForm",controller.submitTripForm)
    .get("/tripPlansList", controller.findAlltripPlans)
    .get('/getAllIds', controller.getAllIds)
    .use(auth.verifyToken)
   
    .post("/createTripPlans", controller.createTripPlans)
    .put("/updateTripPlan", controller.updateTripPlan)
    .post("/getAllTripPlans", controller.getAllTripPlans)
    .get("/viewTripPlan", controller.viewTripPlan)
    
   
