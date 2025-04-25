const {
  getUserById,
  getUserByRefreshToken,
  getUserByEmail,
  createUser,
  updateUserById,
  getUserByEmailOrUsername,
  getUserProfileById,
} = require('./user.service');

const { INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY } = require('../../utils/errors');
const { randomTokenString } = require('../../utils/generateTokenString');

const logger = require('../../utils/logger');
const validationMessage = require('../../helpers/validationMessageFormatter.helper');

const {
  registerUserValidator,
  loginUserValidator,
} = require('./user.validator');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../helpers/jwt.helper');

const generateTokens = async (user, cookies, res) => {
  const { id, role } = user;

  // Generate a new access token
  const accessToken = generateAccessToken({ user: { id, role } });

  // Generate a new refresh token
  const newRefreshToken = generateRefreshToken({ user: { id, role } });

  // Handle existing refresh tokens
  let newRefreshTokenArray = !cookies?.refreshToken
    ? user.refreshToken
    : user.refreshToken.filter((rt) => rt !== cookies.refreshToken);

  if (cookies?.refreshToken) {
    const { refreshToken } = cookies;
    const foundToken = await getUserByRefreshToken(refreshToken);

    // Detected refresh token reuse!
    if (!foundToken) {
      // Clear out ALL previous refresh tokens
      newRefreshTokenArray = [];
    }

    // Clear the existing refresh token cookie
    res.clearCookie('refreshToken');
  }

  // Store the new refresh token
  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await updateUserById(user.id, user);

  return { accessToken, newRefreshToken };
};

const registerUserHandler = async (req, res) => {
  try {
    const { cookies } = req;
    const { name, username, email, password, ...data } = req.body;

    const validateUserRegisterInputs = registerUserValidator(req.body);

    if (validateUserRegisterInputs.error) {
      const validationError = validationMessage(validateUserRegisterInputs.error.details);

      return res.status(UNPROCESSABLE_ENTITY.code).json({
        message: UNPROCESSABLE_ENTITY.message,
        errors: validationError,
      });
    }
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await createUser({
      ...data,
      name,
      username,
      email,
      password,
    });

    const { accessToken, newRefreshToken } = await generateTokens(user, cookies, res);

    const maxAgeInDays = 10;
    const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: maxAgeInMilliseconds,
    });
    const userProfile = await getUserProfileById(user._id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken: newRefreshToken,
      user: userProfile,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const loginUserHandler = async (req, res) => {
  try {
    const { cookies } = req;
    const { email, password } = req.body;

    const validateUserLoginInputs = loginUserValidator(req.body);

    if (validateUserLoginInputs.error) {
      const validationError = validationMessage(validateUserLoginInputs.error.details);

      return res.status(UNPROCESSABLE_ENTITY.code).json({
        message: UNPROCESSABLE_ENTITY.message,
        errors: validationError,
      });
    }
    const user = await getUserByEmailOrUsername(email);

    // Check if the user exists and the password is correct
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, newRefreshToken } = await generateTokens(user, cookies, res);

    const maxAgeInDays = 10;
    const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: maxAgeInMilliseconds,
    });

    const userProfile = await getUserProfileById(user._id);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      accessToken,
      refreshToken: newRefreshToken,
      user: userProfile,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const refreshTokenHandler = async (req, res) => {
  try {
    const { cookies } = req;
    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.refreshToken;
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });

    const user = await getUserByRefreshToken(refreshToken);

    // Detected refresh token reuse!
    if (!user) {
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) return res.status(403).json({ message: 'Forbidden' });

      // Delete all refresh tokens of the hacked user
      const hackedUser = await getUserById(decoded.user.id);
      if (hackedUser) {
        hackedUser.refreshToken = [];
        await updateUserById(hackedUser.id, hackedUser);
      }
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newRefreshTokenArray = user.refreshToken.filter((rt) => rt !== refreshToken);

    // evaluate jwt
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      user.refreshToken = [...newRefreshTokenArray];
      await updateUserById(user.id, user);
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (user.id !== decoded.user.id) return res.status(403).json({ message: 'Forbidden' });

    // Refresh token was still valid
    const accessToken = generateAccessToken({
      user: { id: user.id, role: user.role },
    });

    const newRefreshToken = generateRefreshToken({
      user: { id: user.id, role: user.role },
    });

    // Saving refreshToken with current user
    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await updateUserById(user.id, user);

    const maxAgeInDays = 10;
    const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: maxAgeInMilliseconds,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const logoutUserHandler = async (req, res) => {
  try {
    const { cookies } = req;
    if (!cookies?.refreshToken) return res.status(204).json({ message: 'No content' });
    const refreshToken = cookies.refreshToken;

    // Is refreshToken in db?
    const user = await getUserByRefreshToken(refreshToken);
    if (user) {
      // Delete refreshToken in db
      user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
      await updateUserById(user.id, user);
    }
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports = {
  loginUserHandler,
  registerUserHandler,
  refreshTokenHandler,
  logoutUserHandler,
};
