const jwt = require("jsonwebtoken");

const auth = require("../config/auth");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, auth.accessTokenSecret, {
    expiresIn: auth.accessTokenExpiresIn
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, auth.refreshTokenSecret, {
    expiresIn: auth.refreshTokenExpiresIn
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, auth.accessTokenSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, auth.refreshTokenSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};