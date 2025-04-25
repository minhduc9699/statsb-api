const { Router } = require('express');

const router = Router();

const {
  registerUserHandler,
  loginUserHandler,
  refreshTokenHandler,
  logoutUserHandler,
} = require('../../modules/users/user.controller');

router.post('/login', loginUserHandler);
router.get('/logout', logoutUserHandler);
router.post('/register', registerUserHandler);
router.get('/token', refreshTokenHandler);

module.exports = router;
