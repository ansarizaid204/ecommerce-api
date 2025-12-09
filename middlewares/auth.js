const { sendError } = require("../helpers/api");
const { verifyAccessToken } = require("../helpers/token");
const User = require("../models/user");

async function authCheck(req, res, next) {
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(400).send(sendError("Access token missing", 400));
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (e) {
    return res.status(401).send(sendError("Invalid or expired access token", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).send(sendError("User not found", 401));
  }

  req.user = user;
  next();
}

module.exports = authCheck;
