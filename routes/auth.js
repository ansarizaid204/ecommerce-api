const express = require("express");
const bcrypt = require("bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/token");
const User = require("../models/user");
const Session = require("../models/session");

const config = require("../config/config");
const { sendError, sendResponse } = require("../helpers/api");
const axios = require("axios");
const moment = require("moment");

const router = express.Router();
const COOKIE_NAME = "x-auth-refresh-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config?.auth?.cookieSecure === "true",
  sameSite: "lax",
  domain: config?.auth?.cookieDomain,
  path: "/",
};

function setRefreshCookie(res, token, expiresAt) {
  const opts = { ...COOKIE_OPTIONS };
  if (expiresAt) opts.expires = expiresAt;
  res.cookie(COOKIE_NAME, token, opts);
}

function generateTokenExpiry(duration) {
  const amount = parseInt(duration);
  const unit = duration.replace(/[0-9]/g, "");

  const newExpiresAt = moment().add(amount, unit).toDate();

  return newExpiresAt;
}

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies[COOKIE_NAME];
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      await Session.findOneAndUpdate(
        { sessionId: decoded.sessionId, userId: decoded.id },
        { revoked: true, revokedAt: new Date() }
      );
    } catch (e) {
      //ignore
    }
  }
  res.clearCookie(COOKIE_NAME, {
    domain: config?.auth?.cookieDomain,
    path: "/",
  });
  return res.send(sendResponse("Logout Successfully"));
});

router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies[COOKIE_NAME];
  if (!refreshToken) return res.status(401).send(sendError("No refresh token", 401));

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (e) {
    return res.status(401).send(sendError("Invalid refresh token", 401));
  }

  const session = await Session.findOne({
    sessionId: decoded.sessionId,
    userId: decoded.id,
  });
  if (!session || session.revoked)
    return res.status(401).send(sendError("Session not found or revoked", 401));

  const match = await bcrypt.compare(refreshToken, session.refreshTokenHash);
  if (!match) {
    session.revoked = true;
    session.revokedAt = new Date();
    await session.save();

    await Session.updateMany({ userId: decoded.id }, { revoked: true });
    return res.status(401).send(sendError("Refresh token reuse detected", 401));
  }

  const { token: newRefreshToken, sessionId: newSessionId } = signRefreshToken({
    id: decoded.id,
  });
  const newHash = await bcrypt.hash(newRefreshToken, 10);

  const newExpiresAt = generateTokenExpiry(config?.auth?.refreshTokenExpiresIn);

  session.refreshTokenHash = newHash;
  session.sessionId = newSessionId;
  session.lastSeenAt = new Date();
  session.expiresAt = newExpiresAt;
  await session.save();

  setRefreshCookie(res, newRefreshToken, newExpiresAt);

  const accessToken = signAccessToken({ id: decoded.id });

  res.json({ accessToken });
});

router.get("/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${config?.auth?.googleClientId}` +
    `&redirect_uri=${config?.auth?.googleRedirectUrl}` +
    "&response_type=code" +
    "&scope=openid email profile" +
    "&access_type=offline" +
    "&prompt=consent";

  res.redirect(url);
});

router.get("/google-callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send(sendError("Google login failed", 400));
  }

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: config?.auth?.googleClientId,
      client_secret: config?.auth?.googleClientSecret,
      redirect_uri: config?.auth?.googleRedirectUrl,
      grant_type: "authorization_code",
      code,
    });

    const { id_token } = tokenRes.data;

    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );

    const { email, name, sub: googleId } = googleRes.data;

    if (!email) {
      return res.status(401).send(sendError("Google authentication failed", 401));
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
      });
    }

    const accessToken = signAccessToken({ id: user._id });

    const { token: refreshToken, sessionId } = signRefreshToken({
      id: user._id,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = generateTokenExpiry(config?.auth?.refreshTokenExpiresIn);

    await Session.create({
      sessionId,
      userId: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      expiresAt,
    });

    setRefreshCookie(res, refreshToken, expiresAt);

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).send(sendError("Google login failed", 500));
  }
});

module.exports = router;
