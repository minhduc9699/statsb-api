const playerService = require('./player.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');
const logger = require('../../utils/logger');

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
    const { limit = 10, page = 1, ...filter } = req.query;
    const { players, count } = await playerService.get(filter, limit, page);
    return res.status(200).json({
      message: 'Players fetched successfully',
      data: players,
      page,
      limit,
      count,
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
    const id = req.params._id;
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
    const id = req.params._id;
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
    const id = req.params._id;
    const playerFound = await playerService.getById(id);
    if (!playerFound) {
      return res.status(404).json({
        message: 'Player not found',
      });
    }
    const deletedPlayer = await playerService.remove(id);
    return res.status(200).json({
      message: 'Player deleted successfully',
      data: playerFound,
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
