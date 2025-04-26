const playerService = require('./player.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');

const createHandler = async (req, res) => {
  try {
    const data = req.body;
    const newPlayer = await playerService.create(data);
    return res.status(201).json({
      message: 'Player created successfully',
      data: newPlayer,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const getHandler = async (req, res) => {
  try {
    const filter = req.query;
    const players = await playerService.get(filter);
    return res.status(200).json({
      message: 'Players fetched successfully',
      data: players,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const getOneHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const player = await playerService.getById(id);
    return res.status(200).json({
      message: 'Player fetched successfully',
      data: player,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const updateHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedPlayer = await playerService.update(id, data);
    return res.status(200).json({
      message: 'Player updated successfully',
      data: updatedPlayer,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPlayer = await playerService.remove(id);
    return res.status(200).json({
      message: 'Player deleted successfully',
      data: deletedPlayer,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const playerController = {
  createHandler,
  getHandler,
  getOneHandler,
  updateHandler,
  deleteHandler,
};

module.exports = playerController;