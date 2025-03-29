import tripModel from "../../../models/trip";

const tripServices = {
    createTrip: async (insertObj) => {
        return await tripModel.create(insertObj);
    },
    findTrip: async (query) => {
        return await tripModel.findOne(query);
    },
    updateTrip: async (query, updatedObj) => {
        return await tripModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findTripList: async (query) => {
        return await tripModel.find(query);
    }
}

module.exports = { tripServices };
