const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getUnicodeText } = require('../../utils/getUnicodeText');

const { Schema } = mongoose;
const {
  roles: { USER, STUDENT },
  status: { UNVERIFIED },
  providers: { LOCAL },
  roles,
  status,
  providers,
} = require('./user.enum');

const hashPassword = require('../../helpers/hashPassword.helper');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
    },
    company: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: UNVERIFIED,
      enum: Object.values(status),
    },
    role: { type: String, enum: Object.values(roles), default: USER },
    avatar: String,
    verificationToken: {
      token: String,
      expiresAt: Date,
    },
    verifiedAt: Date,
    refreshToken: [String],
    resetPasswordToken: {
      token: String,
      expiresAt: Date,
    },
    passwordResetAt: Date,
    provider: {
      type: String,
      trim: true,
      default: LOCAL,
      enum: Object.values(providers),
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (!user.isModified('password')) return next();
    const hashedPassword = await hashPassword(this.password);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
