import tripCategory from "../../../models/tripCategory";

const tripCategoryServices = {
    createTripCategory: async (insertObj) => {
        return await tripCategory.create(insertObj);
    },
    findTripCategory: async (query) => {
        return await tripCategory.findOne(query);
    },
    updateTripCategory: async (query, updatedObj) => {
        return await tripCategory.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findCategoryList: async (query) => {
        return await tripCategory.find(query);
    }
}

module.exports = { tripCategoryServices };