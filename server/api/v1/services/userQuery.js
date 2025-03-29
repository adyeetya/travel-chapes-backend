import userQueryModel from "../../../models/userQuery";
const userQueryServices = {
    createQuery: async (insertObj) => {
        return await userQueryModel.create(insertObj);
    }
}

module.exports = {userQueryServices};