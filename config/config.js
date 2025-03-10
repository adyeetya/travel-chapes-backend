import _ from "lodash";
import config from "./config.json";;

// const environment = 'development';
const environment = 'staging';
// const environment = 'production';
const defaultConfig = config.development;
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;