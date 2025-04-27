const { Router } = require('express');

const router = Router();

const matchController = require('../../modules/matches/match.controller');

router.post('/', matchController.createHandler);
router.get('/', matchController.getHandler);
router.get('/:_id', matchController.getOneHandler);
router.put('/:_id', matchController.updateHandler);
router.delete('/:_id', matchController.deleteHandler);

module.exports = router;