import bookingModel from "../../../models/booking";
const bookingServices = {
    createBooking: async (insertObj) => {
        return await bookingModel.create(insertObj);
    },
    findBooking: async (query) => {
        return await bookingModel.findOne(query);
    },
    updateBooking: async (query, updatedObj) => {
        return await bookingModel.findOneAndUpdate(query, updatedObj, { new: true });
    }
}

module.exports = { bookingServices };