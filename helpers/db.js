const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../logger");



const url = config.database.mongo_url;

try {
  mongoose.set("strictQuery", false);
  mongoose.connect(url, {
    useNewUrlParser: true,
  });
} catch (error) {}

module.exports = mongoose.connection;
