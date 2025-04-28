import Express from 'express';
import controller from "./controller"
import auth from "../../../../helper/auth";

export default Express.Router()
    .get("/getCategoryList", controller.getTripCategoryList)
    .use(auth.verifyToken)
    .post("/createTripCategory", controller.createTripCategory)
    .put("/updateTripCategory", controller.updateTripCategory)

