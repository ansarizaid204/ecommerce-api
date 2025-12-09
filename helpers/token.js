const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

const ACCESS_SECRET = config?.auth?.accessTokenSecret;
const REFRESH_SECRET = config?.auth?.refreshTokenSecret;
const ACCESS_EXPIRES = config?.auth?.accessTokenExpiresIn;
const REFRESH_EXPIRES = config?.auth?.refreshTokenExpiresIn;

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  const sessionId = uuidv4();
  return {
    token: jwt.sign({ ...payload, sessionId }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES,
    }),
    sessionId,
  };
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
