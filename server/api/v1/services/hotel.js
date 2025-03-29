import hotelModel from "../../../models/hotel";

const hotelServices = {
    createHotel: async (insertObj) => {
        return await hotelModel.create(insertObj);
    },
    findHotel: async (query) => {
        return await hotelModel.findOne(query);
    },
    updateHotel: async (query, updatedObj) => {
        return await hotelModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findHotelList: async (query) => {
        return await hotelModel.find(query);
    }
}

module.exports = { hotelServices };
