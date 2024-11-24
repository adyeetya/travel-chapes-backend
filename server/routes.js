import userContent from "./api/v1/controllers/user/routes"

export default function routes(app) {
    app.use('/api/v1/user', userContent)
    return app;
}