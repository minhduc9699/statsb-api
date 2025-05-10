const express = require('express');
const router = express.Router();
const matchController = require('./match.controller');
const matchStatsController = require('./stats/matchStats.controller');
const matchEventRoutes = require('./events/matchEvent.routes');

// Standard CRUD operations
router.get('/', matchController.getHandler);
router.get('/:id', matchController.getOneHandler);
router.post('/', matchController.createHandler);
router.put('/:id', matchController.updateHandler);
router.delete('/:id', matchController.deleteHandler);

// Custom endpoint for match stats
router.get('/:matchId/stats', matchStatsController.getMatchStats);
router.post('/:matchId/stats/update', matchStatsController.updateMatchStats);

// Nested routes for match events
router.use('/:matchId/events', matchEventRoutes);

module.exports = router;
