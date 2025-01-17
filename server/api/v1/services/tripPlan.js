import status from "../../../enums/status";
import tripPlanModel from "../../../models/tripPlans";

const tripPlanServices = {
    createTripPlans: async (insertObj) => {
        return await tripPlanModel.create(insertObj);
    },
    findTripPlans: async (query) => {
        return await tripPlanModel.findOne(query);
    },
    updateTripPlans: async (query, updatedObj) => {
        return await tripPlanModel.update(query, updatedObj, { new: true });
    },
    findAlltripPlans: async (validateBody) => {
        let query = { status: { $eq: status.active } }
        let { page, limit, category, startDate, endDate } = validateBody;
        if (category) {
            query.category = { $in: [category] };
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 4,
            sort: { createdAt: -1 }
        }
        return tripPlanModel.paginate(query, options)
    }
}

module.exports = { tripPlanServices }