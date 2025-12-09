const { sendError } = require("../helpers/api");

module.exports = (err, req, res, next) => {
  if (err) {
    res.status(500).send(sendError(err.message, 500));
  }
  next();
};
