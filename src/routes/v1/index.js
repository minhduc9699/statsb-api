const express = require('express');
const docsRoute = require('./docs.route');
const authRoutes = require('../../modules/users/auth.route');
const playerRoutes = require('../../modules/players/player.route');
const teamRoutes = require('../../modules/teams/team.route');
const matchRoutes = require('../../modules/matches/match.route');
const { authMiddleware } = require('../../middlewares');

const router = express.Router();

const publicRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/players',
    route: playerRoutes,
  },
  {
    path: '/teams',
    route: teamRoutes,
  },
  {
    path: '/matches',
    route: matchRoutes,
  }
];

const authGuardedRoutes = [
  // Add your new routes here
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

publicRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

authGuardedRoutes.forEach((route) => {
  router.use(route.path, authMiddleware, route.route);
});

devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
