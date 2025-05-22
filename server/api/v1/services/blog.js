import blogModel from "../../../models/blog";
const blogServices = {
    createBlog: async (insertObj) => {
        return await blogModel.create(insertObj);
    },
    findBlog: async (query) => {
        return await blogModel.findOne(query);
    },
    updateBlog: async (query, updatedObj) => {
        return await blogModel.update(query, updatedObj, { new: true });
    },
    findBlogs: async (query) => {
        return await blogModel.find(query);
    }
}

module.exports = { blogServices };