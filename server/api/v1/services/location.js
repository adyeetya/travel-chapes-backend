import locationModel from "../../../models/location";
const locationServices = {
    createLocation: async (insertObj) => {
        return await locationModel.create(insertObj);
    },
    findLocation: async (query) => {
        return await locationModel.findOne(query);
    },
    updateLocation: async (query, updatedObj) => {
        return await locationModel.update(query, updatedObj, { new: true });
    },
    findLocationList: async (query) => {
        return await locationModel.findAll(query);
    }
}

module.exports = { locationServices };