import express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
export default express.Router()
    .get("/blogList", controller.blogsList)
    .use(auth.verifyToken)
    .post("/createBlog", controller.createBlog)
    .get("/viewBlog", controller.findBlog)
    .put("/updateBlog", controller.updateBlog)