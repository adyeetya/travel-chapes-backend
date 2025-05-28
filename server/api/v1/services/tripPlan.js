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
        return await tripPlanModel.updateOne(query, updatedObj, { new: true });
    },
    getTripPlans: async (query) => {
        return await tripPlanModel.find(query).select('fullItinerary');
    },
    // findAlltripPlans: async (validateBody) => {
    //     // console.log("validateBody", validateBody);
    //     let query = { status: { $eq: status.active } }
    //     // console.log("query", query);
    //     let { page, limit, category, startDate, endDate } = validateBody;
    //     // console.log("validateBody", validateBody);
    //     if (category) {
    //         query.category = { $in: [category] };
    //     }
    //     if (startDate || endDate) {
    //         query.createdAt = {};
    //         if (startDate) {
    //             query.createdAt.$gte = new Date(startDate);
    //         }
    //         if (endDate) {
    //             query.createdAt.$lte = new Date(endDate);
    //         }
    //     }
    //     let options = {
    //         page: Number(page) || 1,
    //         limit: Number(limit) || 4,
    //         sort: { createdAt: -1 }
    //     }
    //     // console.log("query", query);
    //     return tripPlanModel.paginate(query, options)
    // },

    findAlltripPlans: async (validateBody) => {
        let query = { status: { $eq: status.active } }
        let { category, startDate, endDate, search } = validateBody;

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
        if (search) {
            query.$or = [
                {
                    city: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        // Get all documents sorted by createdAt in descending order
        const docs = await tripPlanModel.find(query).sort({ createdAt: -1 });

        // Return in same structure as pagination but with all data
        return {
            docs,
            totalDocs: docs.length,
            limit: docs.length,
            totalPages: 1,
            page: 1,
            pagingCounter: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null
        };
    },
    getTripPlanCategories: async (query) => {
        return await tripPlanModel.find(query).select('category'); ''
    }
}

module.exports = { tripPlanServices }