import tripModel from "../../../models/trip";

const tripServices = {
    createTripDetails: async (insertObj) => {
        // console.log('insertObj', insertObj);
        return await tripModel.create(insertObj);
    },
    findTrip: async (query) => {
        return await tripModel.findOne(query);
    },
    updateTrip: async (query, updatedObj) => {
        return await tripModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findTripList: async (query) => {
        return await tripModel.find(query).populate("vehicles").populate("stays").populate([{ path: "locationId" }]);
    },
    findPopulateTrip: async (query) => {
        return await tripModel.findOne(query).populate("vehicles").populate("stays").populate([{ path: "locationId" }]);
    }
}

module.exports = { tripServices };
