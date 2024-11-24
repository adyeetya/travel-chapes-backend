const userModel = require("../../../models/user");
const userServices = {
    createUser: async (insertObj) => {
        return await userModel.create(insertObj);
    },
    checkEmailMobileExist: async (mobile_number, email, id) => {
        let query = { $and: [{ $or: [{ email: email }, { mobile_number: mobile_number }, { _id: { $ne: id } }] }] }
        return await userModel.findOne(query);
    },
    findUser: async (query) => {
        return await userModel.findOne(query);
    },
    findUserByuserId: async (query) => {
        return await userModel.findOne(query);
    },
    updateUser: async (query, obj) => {
        return await userModel.updateOne(query, obj, { new: true })
    },
}

module.exports = { userServices };