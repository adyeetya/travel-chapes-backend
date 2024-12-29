import tripFormModel from "../../../models/tripForm";

const tripFormServices = {
    createTripForm: async (insertObj) => {
        return await tripFormModel.create(insertObj);
    }
}

module.exports = { tripFormServices }