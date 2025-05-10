const { Router } = require('express');

const router = Router();

const playerController = require('./player.controller');

router.post('/', playerController.createHandler);
router.get('/', playerController.getHandler);
router.get('/:_id', playerController.getOneHandler);
router.put('/:_id', playerController.updateHandler);
router.delete('/:_id', playerController.deleteHandler);

module.exports = router;
