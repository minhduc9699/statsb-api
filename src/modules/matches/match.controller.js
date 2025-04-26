const matchService = require('./match.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');

const createHandler = async (req, res) => {
  try {
    const data = req.body;
    const newMatch = await matchService.create(data);
    return res.status(201).json({
      message: 'Match created successfully',
      data: newMatch,
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
    const matches = await matchService.get(filter);
    return res.status(200).json({
      message: 'Matches fetched successfully',
      data: matches,
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
    const match = await matchService.getOne(id);
    return res.status(200).json({
      message: 'Match fetched successfully',
      data: match,
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
    const updatedMatch = await matchService.update(id, data);
    return res.status(200).json({
      message: 'Match updated successfully',
      data: updatedMatch,
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
    const deletedMatch = await matchService.remove(id);
    return res.status(200).json({
      message: 'Match deleted successfully',
      data: deletedMatch,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const matchController = {
  createHandler,
  getHandler,
  getOneHandler,
  updateHandler,
  deleteHandler,
};

module.exports = matchController;