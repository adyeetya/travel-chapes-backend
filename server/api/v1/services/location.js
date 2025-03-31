import locationModel from "../../../models/location";
const locationServices = {
    createLocation: async (insertObj) => {
       
        return await locationModel.create(insertObj);
    },
    findLocation: async (query) => {
        return await locationModel.findOne(query);
    },
    updateLocation: async (query, updatedObj) => {
        return await locationModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    
    findLocationList: async (query) => {
        // console.log('query', locationModel.find(query))
        return await locationModel.find(query);
    }
}

module.exports = { locationServices };