const { Router } = require('express');

const router = Router();

const playerController = require('../../modules/players/player.controller');

router.post('/create', playerController.createHandler);
router.get('/get', playerController.getHandler);
router.get('/get/:_id', playerController.getOneHandler);
router.put('/update:_id', playerController.updateHandler);
router.delete('/delete:_id', playerController.deleteHandler);

module.exports = router;
