const JWT = require('jsonwebtoken');
const {
  jwt: { accessTokenSecret, refreshTokenSecret, accessTokenExpirationMinutes, refreshTokenExpirationDays },
} = require('../config/config');

const generateAccessToken = (user) => {
  return JWT.sign(user, accessTokenSecret, { expiresIn: `${accessTokenExpirationMinutes}m` });
};

const generateRefreshToken = (user) => {
  return JWT.sign(user, refreshTokenSecret, { expiresIn: `${refreshTokenExpirationDays}d` });
};

const verifyAccessToken = (token) => {
  try {
    return JWT.verify(token, accessTokenSecret);
  } catch (err) {
    return null; // Invalid token
  }
};

const verifyRefreshToken = (token) => {
  try {
    return JWT.verify(token, refreshTokenSecret);
  } catch (err) {
    return null; // Invalid token
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
