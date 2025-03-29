import _ from "lodash";
import config from "./config.json";;
// console.log(config);

// const environment = 'development';
const environment = 'staging';
// const environment = 'production';
const defaultConfig = config.development;
// console.log("defaultConfig>>>>>>>>>..",defaultConfig);

const environmentConfig = config[environment];
// console.log("environmentConfig>>>>>>>>.",environmentConfig);

const finalConfig = _.merge(defaultConfig,environmentConfig);
global.gConfig = finalConfig;