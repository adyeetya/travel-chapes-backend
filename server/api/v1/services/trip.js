import tripModel from "../../../models/trip";
import customerModel from "../../../models/customer";

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
        const trips = await tripModel.find(query)
            .populate("vehicles")
            .populate("stays")
            .populate("locationId");
        const tripsWithCustomerCount = await Promise.all(
            trips.map(async (trip) => {
                const customerCount = await customerModel.countDocuments({ tripId: trip._id });
                const tripObj = trip.toObject();
                tripObj.customerCount = customerCount;
                return tripObj;
            })
        );

        return tripsWithCustomerCount;
    },
    findPopulateTrip: async (query) => {
        return await tripModel.findOne(query).populate("vehicles").populate("stays").populate([{ path: "locationId" }]);
    }
}

module.exports = { tripServices };
