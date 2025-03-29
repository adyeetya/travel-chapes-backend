import userContent from "./api/v1/controllers/user/routes";
import tripPlansContent from "./api/v1/controllers/tripPlans/routes";
import adminContent from "./api/v1/controllers/admin/routes";
import tripRequirementContent from "./api/v1/controllers/tripRequirement/routes"
export default function routes(app) {
    app.use('/api/v1/user', userContent);
    app.use("/api/v1/tripPlans", tripPlansContent);
    app.use("/api/v1/admin", adminContent);
    app.use("/api/v1/tripRequirement", tripRequirementContent)
    return app;
}

