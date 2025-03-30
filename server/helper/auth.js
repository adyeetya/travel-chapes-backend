const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const adminModel = require("../models/admin")
require("../../config/config");

module.exports = {
    async verifyToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(400).send({
                    responseCode: 400,
                    responseMessage: 'Token required. Please provide a valid Bearer token.'
                });
            }

            // Extract token from "Bearer <token>"
            const token = authHeader.split(' ')[1];
            console.log('token:', token);
            
            jwt.verify(token, global.gConfig.jwtsecret, async (err, result) => {
                if (err) {
                    return res.status(401).send({ responseCode: 401, responseMessage: 'Unauthorized' });
                }
                let userResult
                userResult = await userModel.findOne({ _id: result.userId });
                if (!userResult) {
                    userResult = await adminModel.findOne({ _id: result.userId });
                    if (!userResult) {
                        return res.status(404).send({ responseCode: 404, responseMessage: 'User not found' });
                    }

                }

                console.log('result:', result);
                console.log('userResult:', userResult);

                // Attach user information to the request object for further use
                req.userId = result.userId;
                req.mobileNumber = result.mobileNumber;
                req.userDetails = result;

                next(); // Proceed to the next middleware or route handler
            });
        } catch (error) {
            console.error('Error in verifyToken middleware:', error);
            res.status(500).send({ responseCode: 500, responseMessage: 'Internal Server Error' });
        }
    }


}