require("../config/config");
import Server from "./common/server";
import Routes from "./routes"

let dbUrl;

dbUrl = global.gConfig.config_id === 'development' ? `mongodb://${global.gConfig.hostAddress}:${global.gConfig.databasePort}/${global.gConfig.databaseName}` :
        global.gConfig.config_id === 'staging'?  `mongodb+srv://${global.gConfig.dbCredential.user}:${global.gConfig.dbCredential.password}@${global.gConfig.dbCredential.host}/${global.gConfig.dbCredential.dbName}`:
        global.gConfig.config_id === 'production'?  `mongodb+srv://${global.gConfig.dbCredential.user}:${global.gConfig.dbCredential.password}@${global.gConfig.dbCredential.host}/${global.gConfig.dbCredential.dbName}`:
    'mongodb+srv://2612adityasingh2000:kkhxx3RNuvX3dVhD@cluster0.8p16f.mongodb.net/travel-chapes?retryWrites=true&w=majority&appName=Cluster0'
// console.log(dbUrl)

const port = global.gConfig.port;
const server = new Server()
    .router(Routes)
    .handleError()
    .configureDb(dbUrl)
    .then((_server) => _server.listen(port));



export default server;