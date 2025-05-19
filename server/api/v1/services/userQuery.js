import userQueryModel from "../../../models/userQuery";
const userQueryServices = {
    createQuery: async (insertObj) => {
        return await userQueryModel.create(insertObj);
    },
    getQueries: async () => {
        return await userQueryModel.find({}).sort({ createdAt: -1 });
    },
    updateQueryStatus: async (queryId, status) => {
        return await userQueryModel.findByIdAndUpdate(queryId, { status }, { new: true });
    }
}

module.exports = {userQueryServices};