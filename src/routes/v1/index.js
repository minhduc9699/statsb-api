const express = require('express');
const docsRoute = require('./docs.route');
const authRoutes = require('./auth.route');
const playerRoutes = require('./player.route');
const teamRoutes = require('./team.route');
const matchRoutes = require('./match.route');
const eventRoutes = require('./event.route');
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
  },
  {
    path: '/events',
    route: eventRoutes,
  },
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
