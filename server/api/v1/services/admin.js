import adminModel from "../../../models/admin";
const adminServices = {
    createAdmin: async (insertObj) => {
        return await adminModel.create(insertObj);
    },
    findAdmin: async (query) => {
        return await adminModel.findOne(query);
    },
    findAdminByuserId: async (query) => {
        return await adminModel.findOne(query);
    },
    findAdmins: async (query) => {
        return await adminModel.find(query);
    },
    updateAdmin: async (query, obj) => {
        return await adminModel.updateOne(query, obj, { new: true })
    },
}

module.exports = { adminServices };