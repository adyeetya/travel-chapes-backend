import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default Express.Router()
    .use(auth.verifyToken)
    .post("/createSubAdmin", controller.createSubAdmin)
    .get("/getsubAdmins", controller.getSubAdmin)
    .get("/viewSubadmin", controller.viewSubadmin)
    .put("/updateSubadmin", controller.updateSubadmin)
    .delete("/deleteSubadmin", controller.deleteSubadmin)
