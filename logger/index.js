const buildDevLogger = require('./dev_logger');
const buildProdLogger = require('./prod_logger');
const config =require("../config/config");


let logger = null;
if (config.app_mode === 'production') {
  logger =buildProdLogger();
} else {
  logger = buildDevLogger();
}

module.exports = logger;