import customerModel from "../../../models/customer";

const customerServices = {
    createCustomer: async (insertObj) => {
        return await customerModel.create(insertObj);
    },
    findCustomer: async (query) => {
        return await customerModel.findOne(query);
    },
    updateCustomer: async (query, updatedObj) => {
        return await customerModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findCustomerList: async (query) => {
        return await customerModel.find(query).populate([{ path: "tripId" }, { path: "createdBy", select: "email mobileNumber" }])
    },
    findPopulatedCustomer: async (query) => {
        return await customerModel.findOne(query).populate([{ path: "tripId" }, { path: "createdBy", select: "email mobileNumber" }])
    }
}

module.exports = { customerServices }