const { Router } = require('express');

const router = Router();

const eventController = require('../../modules/events/event.controller');

router.post('/', eventController.createHandler);
router.get('/', eventController.getHandler);
router.get('/:_id', eventController.getOneHandler);
router.put('/:_id', eventController.updateHandler);
router.delete('/:_id', eventController.deleteHandler);

module.exports = router;