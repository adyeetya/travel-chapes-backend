import vehicaleModel from "../../../models/vehicale";

const vehicaleServices = {
    createVehicale: async (insertObj) => {
        return await vehicaleModel.create(insertObj);
    },
    findVehicale: async (query) => {
        return await vehicaleModel.findOne(query);
    },
    updateVehicale: async (query, updatedObj) => {
        return await vehicaleModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findVehicaleList: async (query) => {
        return await vehicaleModel.find(query);
    }
}

module.exports = { vehicaleServices };
