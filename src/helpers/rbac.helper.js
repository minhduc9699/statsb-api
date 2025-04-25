const roles = Object.freeze({
  SYS_ADMIN: 'ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
});

const resources = Object.freeze({
  USERS: 'USERS',
});

const adminRoles = [roles.SYS_ADMIN, roles.ADMIN];

module.exports = {
  roles,
  resources,
  adminRoles,
};
