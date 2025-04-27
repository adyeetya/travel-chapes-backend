import bookingModel from "../../../models/booking";
const bookingServices = {
    createBooking: async (insertObj) => {
        return await bookingModel.create(insertObj);
    },
    findBooking: async (query) => {
        return await bookingModel.findOne(query).populate('userId', 'name email').populate('tripId', 'name destination');;
    },
    updateBooking: async (query, updatedObj) => {
        return await bookingModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findBookingList: async (query) => {
        return await bookingModel.find(query).populate('userId', 'name email contact').populate('tripId', 'name destination startDate endDate').sort({ createdAt: -1 })
    }
}

module.exports = { bookingServices };