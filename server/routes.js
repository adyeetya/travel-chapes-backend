import userContent from "./api/v1/controllers/user/routes"
import tripPlansContent from "./api/v1/controllers/tripPlans/routes"
export default function routes(app) {
    app.use('/api/v1/user', userContent)
    app.use("/api/v1/tripPlans",tripPlansContent)
    return app;
}