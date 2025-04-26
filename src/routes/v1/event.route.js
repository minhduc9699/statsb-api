const { Router } = require('express');

const router = Router();

const eventController = require('../../modules/events/event.controller');

router.post('/create', eventController.createHandler);
router.get('/get', eventController.getHandler);
router.get('/get/:_id', eventController.getOneHandler);
router.put('/update:_id', eventController.updateHandler);
router.delete('/delete:_id', eventController.deleteHandler);

module.exports = router;