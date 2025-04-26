const { Router } = require('express');

const router = Router();

const matchController = require('../../modules/matches/match.controller');

router.post('/create', matchController.createHandler);
router.get('/get', matchController.getHandler);
router.get('/get/:_id', matchController.getOneHandler);
router.put('/update:_id', matchController.updateHandler);
router.delete('/delete:_id', matchController.deleteHandler);

module.exports = router;