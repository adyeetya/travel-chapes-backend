import vehicaleModel from "../../../models/vehicale";

const vehicaleServices = {
    createVehicale: async (insertObj) => {
        return await vehicaleModel.create(insertObj);
    },
    findVehicale: async (query) => {
        return await vehicaleModel.findOne(query);
    },
    updateVehicale: async (query, updatedObj) => {
        return await vehicaleModel.update(query, updatedObj, { new: true });
    },
    findVehicaleList: async (query) => {
        return await vehicaleModel.findAll(query);
    }
}

module.exports = { vehicaleServices };
