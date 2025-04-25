const {
  roles: { SYS_ADMIN },
} = require('../helpers/rbac.helper');

module.exports = async (req, res, next) => {
  if (req.user.role === SYS_ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};
