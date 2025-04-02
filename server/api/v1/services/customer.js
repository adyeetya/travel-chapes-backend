import customerModel from "../../../models/customer";

const customerServices = {
    createCustomer: async (insertObj) => {
        return await customerModel.create(insertObj);
    },
    findCustomer: async (query) => {
        return await customerModel.findOne(query);
    },
    updateCustomer: async (query, updatedObj) => {
        return await customerModel.update(query, updatedObj, { new: true });
    },
    findCustomerList: async (query) => {
        return await customerModel.findAll(query).populate([{ path: "tripId" }])
    },
    findPopulatedCustomer: async (query) => {
        return await customerModel.findOne(query).populate([{ path: "tripId" }])
    }
}

module.exports = { customerServices }