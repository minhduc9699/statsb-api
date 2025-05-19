const express = require('express');
const router = express.Router();
const matchController = require('./match.controller');
const matchStatsController = require('./stats/matchStats.controller');
const matchEventRoutes = require('./events/matchEvent.routes');

router.get('/', matchController.getHandler);
router.post('/', matchController.createHandler);

router.post('/stats/batchCalculate', matchController.batchCalculateStatsHandler);
router.get('/:matchId/stats', matchStatsController.getMatchStats);
router.post('/:matchId/stats/update', matchStatsController.updateMatchStats);

router.use('/:matchId/events', matchEventRoutes);

router.get('/:id', matchController.getOneHandler);
router.put('/:id', matchController.updateHandler);
router.delete('/:id', matchController.deleteHandler);

module.exports = router;
