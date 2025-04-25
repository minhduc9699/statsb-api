const Joi = require('joi');

const options = { abortEarly: false, stripUnknown: true };

const registerUserValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data, options);
};

const loginUserValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data, options);
};

const forgotPasswordValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });
  return schema.validate(data, options);
};

const resetPasswordValidator = (data) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });
  return schema.validate(data, options);
};

const verifyUserEmailValidator = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return schema.validate(data, options);
};

const updateUserProfileValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    avatar: Joi.string().optional(),
    currentPassword: Joi.string().optional(),
    newPassword: Joi.when('currentPassword', {
      is: Joi.exist(),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
  });
  return schema.validate(data, options);
};

module.exports = {
  registerUserValidator,
  loginUserValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyUserEmailValidator,
  updateUserProfileValidator,
};
