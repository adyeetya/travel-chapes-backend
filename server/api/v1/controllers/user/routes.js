import Express from 'express';
import controller from "./controller"
module.exports = Express.Router()
     .post('/signup', controller.signup)
     .put('/verifyOtp', controller.verifyOtp)
     .post('/resendOtp', controller.resendOtp)
     .post('/loginUser', controller.userLogin)
     .put("/verifyLoginOtp", controller.verifyLoginOtp)
     .get("/validateToken", controller.validateToken)

     // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2NiZGEyOTJjZDFmY2M5NDM2NjA4ZmQiLCJtb2JpbGVOdW1iZXIiOiI4MTcyODQ1NDg4IiwiaWF0IjoxNzQxNDEyOTY3LCJleHAiOjE3NDQwMDQ5Njd9.LCG83lv7pan5BQdXi_Y4gsUkPRI7cuGhY0q5_C616jM