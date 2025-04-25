const { UNPROCESSABLE_ENTITY } = require('../utils/errors');

const checkResourceOwnership = (getResourceById) => async (req, res, next) => {
  try {
    const { params, user } = req;
    const resource = await getResourceById({ id: params._id });
    req.resource = resource;
    if (user.role === 'ADMIN') {
      return next();
    }
    if (resource.createdBy.toString() !== user.id) {
      return res.status(UNPROCESSABLE_ENTITY.code).json({
        message: 'Access denied: You do not own this resource',
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(UNPROCESSABLE_ENTITY.code).json({
        message: 'Access denied: Insufficient permissions',
      });
    }
    next();
  };

module.exports = {
  checkResourceOwnership,
  restrictTo,
};
