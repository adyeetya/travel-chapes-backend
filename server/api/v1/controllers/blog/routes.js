import express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default express.Router()
    .get("/blogList", controller.blogsList)
    .get("/viewBlog", controller.findBlog)
    .use(auth.verifyToken)
    .post("/createBlog", controller.createBlog)

    .put("/updateBlog", controller.updateBlog)