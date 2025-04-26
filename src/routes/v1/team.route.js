const { Router } = require('express');

const router = Router();

const teamController = require('../../modules/teams/team.controller');

router.post('/create', teamController.createHandler);
router.get('/get', teamController.getHandler);
router.get('/get/:_id', teamController.getOneHandler);
router.put('/update:_id', teamController.updateHandler);
router.delete('/delete:_id', teamController.deleteHandler);

module.exports = router;
