import userContent from "./api/v1/controllers/user/routes";
import tripPlansContent from "./api/v1/controllers/tripPlans/routes";
import adminContent from "./api/v1/controllers/admin/routes";
import tripRequirementContent from "./api/v1/controllers/tripRequirement/routes";
import customerContent from "./api/v1/controllers/customer/routes";
import bookingContent from "./api/v1/controllers/booking/routes";
import paymemtContent from "./api/v1/controllers/payment/routes";
import subadminContent from "./api/v1/controllers/subAdmin/routes";
export default function routes(app) {
    app.use('/api/v1/user', userContent);
    app.use("/api/v1/tripPlans", tripPlansContent);
    app.use("/api/v1/admin", adminContent);
    app.use("/api/v1/tripRequirement", tripRequirementContent);
    app.use("/api/v1/customer", customerContent);
    app.use("/api/v1/booking", bookingContent);
    app.use("/api/v1/payment", paymemtContent);
    app.use("/api/v1/subAdmin", subadminContent);
    return app;
}

