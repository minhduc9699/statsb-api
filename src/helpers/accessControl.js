const { AccessControl } = require('accesscontrol');
const { resources, roles } = require('./rbac.helper');

const { SYS_ADMIN } = roles;

const grantObjects = {
  USER: {
    USERS: {
      'read:own': ['*'],
    },
  },
  STUDENT: {
    QUIZZES: {
      'read:any': ['*', '!answerIndexes'],
    },
    EXAMS: {
      'read:any': ['*', '!quizzes.answerIndexes'],
    },
    ROOMS: {
      'read:any': ['*'],
    },
  },
  CONTRIBUTOR: {
    SUBJECTS: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    ROOMS: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    QUIZZES: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    EXAMS: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
};

const ac = new AccessControl(grantObjects);
const allResources = Object.values(resources);

// prettier-ignore
ac.grant(SYS_ADMIN).create(allResources).read(allResources).update(allResources).delete(allResources);

module.exports = ac;
