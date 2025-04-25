const User = require('./user.model');

const createUser = async (inputs) => {
  return User.create(inputs);
};

const getUsers = async (filter) => {
  const users = await User.find(filter).select('-password -refreshToken -verificationToken -resetPasswordToken').lean();
  return users;
};

const getOneUser = async (filter) => {
  const user = await User.findOne(filter).select('-password -refreshToken -verificationToken -resetPasswordToken').lean();
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const getUserProfileById = async (id) => {
  const user = await User.findById(id).select('-password -refreshToken -verificationToken -resetPasswordToken').lean();
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const deleteUserById = async (id) => {
  return User.findByIdAndDelete(id);
};

const getUserByEmailOrUsername = async (input) => {
  const user = await User.findOne({
    $or: [
      {
        email: input,
      },
      {
        username: input,
      },
    ],
  });
  return user;
};

const getUserByUsername = async (username) => {
  const user = await User.findOne({
    username,
  });
  return user;
};

const getUserByRefreshToken = async (refreshToken) => {
  return User.findOne({ refreshToken }).exec();
};

const getUserByResetPassToken = async (resetPasswordToken) => {
  return User.findOne({
    'resetPasswordToken.token': resetPasswordToken,
    'resetPasswordToken.expiresAt': { $gt: Date.now() },
  }).exec();
};

const getUserByVerifyEmailToken = async (verificationToken) => {
  return User.findOne({
    'verificationToken.token': verificationToken,
    'verificationToken.expiresAt': { $gt: Date.now() },
  }).exec();
};

const updateUserById = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true })
    .select('-password -refreshToken -verificationToken -resetPasswordToken')
    .lean();
  return user;
};

module.exports = {
  createUser,
  getUsers,
  updateUserById,
  getUserById,
  getOneUser,
  getUserByEmail,
  getUserByRefreshToken,
  getUserByResetPassToken,
  getUserByVerifyEmailToken,
  getUserProfileById,
  getUserByUsername,
  getUserByEmailOrUsername,
  deleteUserById,
};
