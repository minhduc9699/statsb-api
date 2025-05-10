const { Router } = require('express');

const router = Router();

const teamController = require('./team.controller');

router.post('/', teamController.createHandler);
router.get('/', teamController.getHandler);
router.get('/:_id', teamController.getOneHandler);
router.put('/:_id', teamController.updateHandler);
router.delete('/:_id', teamController.deleteHandler);

module.exports = router;
