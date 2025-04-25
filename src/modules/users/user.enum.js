const roles = Object.freeze({
  SYS_ADMIN: 'ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
  STUDENT: 'STUDENT',
  CONTRIBUTOR: 'CONTRIBUTOR',
});

const status = Object.freeze({
  VERIFIED: 'VERIFIED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  UNVERIFIED: 'UNVERIFIED',
  INVITED: 'INVITED',
  SUSPENDED: 'SUSPENDED',
});

const providers = Object.freeze({
  GOOGLE: 'GOOGLE',
  LOCAL: 'LOCAL',
});

module.exports = {
  roles,
  status,
  providers,
};
