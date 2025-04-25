const { verifyAccessToken } = require('../../helpers/jwt.helper');
const { FORBIDDEN } = require('../../utils/errors');
const {
  roles: { STUDENT, CONTRIBUTOR, SYS_ADMIN },
} = require('../../helpers/rbac.helper');

const userAuthMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res.status(FORBIDDEN.code).json({ message: FORBIDDEN.message });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(FORBIDDEN.code).json({ message: FORBIDDEN.message });
    }

    next();
  };
};

const userUpdateMiddleware = async (req, res, next) => {
  const { user } = req;
  const { _id } = req.params;

  if (!user || !user.role) {
    return res.status(FORBIDDEN.code).json({ message: FORBIDDEN.message });
  }

  // If user is student, they can only update their own profile
  if (user.role === STUDENT && user.id !== _id) {
    return res.status(FORBIDDEN.code).json({ message: 'Students can only update their own profile' });
  }

  // Only SYS_ADMIN can update other profiles
  if (user.role !== SYS_ADMIN && user.id !== _id) {
    return res.status(FORBIDDEN.code).json({ message: 'Only system administrators can update other user profiles' });
  }

  next();
};

const forgotPasswordMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return next();
  const token = authHeader.split(' ')[1];
  const decodedToken = verifyAccessToken(token);
  req.user = decodedToken.user;
  next();
};

module.exports = {
  userAuthMiddleware,
  userUpdateMiddleware,
  forgotPasswordMiddleware,
};
