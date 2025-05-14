import tripModel from "../../../models/trip";
import customerModel from "../../../models/customer";

const tripServices = {
    createTripDetails: async (insertObj) => {
        // console.log('insertObj', insertObj);
        return await tripModel.create(insertObj);
    },
    findTrip: async (query) => {
        // console.log('query', query);
        return await tripModel.findOne(query);
    },
    findTrips: async (query) => {
        return await tripModel.find(query);
    },
    updateTrip: async (query, updatedObj) => {
        return await tripModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    // findTripList: async (query) => {
    //     const trips = await tripModel.find(query)
    //         .populate("vehicles")
    //         .populate("stays")
    //         .populate("locationId");
    //     const tripsWithCustomerCount = await Promise.all(
    //         trips.map(async (trip) => {
    //             const customerCount = await customerModel.countDocuments({ tripId: trip._id });
    //             const tripObj = trip.toObject();
    //             tripObj.customerCount = customerCount;
    //             return tripObj;
    //         })
    //     );
    //     console.log('tripsWithCustomerCount', tripsWithCustomerCount);
    //     return tripsWithCustomerCount;
    // },
    
    findTripList: async (query) => {
        const trips = await tripModel.find(query)
            .populate("vehicles")
            .populate("stays")
            .populate("locationId");
        
        if (!trips || trips.length === 0) {
            return [];
        }
        
        const tripsWithCustomerCount = await Promise.all(
            trips.map(async (trip) => {
                const customerCount = await customerModel.countDocuments({ tripId: trip._id });
                const tripObj = trip.toObject();
                
                // Convert pricing Map to a plain object
                if (tripObj.pricing instanceof Map) {
                    tripObj.pricing = Object.fromEntries(tripObj.pricing.entries());
                } else if (typeof tripObj.pricing === 'object' && tripObj.pricing !== null) {
                    // If it's already an object, ensure nested Maps are converted
                    for (const key in tripObj.pricing) {
                        if (tripObj.pricing[key] instanceof Map) {
                            tripObj.pricing[key] = Object.fromEntries(tripObj.pricing[key].entries());
                        }
                    }
                }
                
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
