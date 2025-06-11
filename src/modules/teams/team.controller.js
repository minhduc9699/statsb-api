const teamService = require('./team.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');
const logger = require('../../utils/logger');

const createHandler = async (req, res) => {
  try {
    const data = req.body;
    const newTeam = await teamService.create(data);
    return res.status(201).json({
      message: 'Team created successfully',
      data: newTeam,
    });
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const getHandler = async (req, res) => {
  try {
    const { limit = 10, page = 1, ...filter } = req.query;
    const { teams, count } = await teamService.get(filter, limit, page);
    return res.status(200).json({
      message: 'Teams fetched successfully',
      data: teams,
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
    const team = await teamService.getById(id);
    return res.status(200).json({
      message: 'Team fetched successfully',
      data: team,
    });
  } catch (error) {
    logger.error(error)
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const updateHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedTeam = await teamService.update(id, data);
    return res.status(200).json({
      message: 'Team updated successfully',
      data: updatedTeam,
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
    const deletedTeam = await teamService.remove(id);
    return res.status(200).json({
      message: 'Team deleted successfully',
      data: deletedTeam,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const teamController = {
  createHandler,
  getHandler,
  getOneHandler,
  updateHandler,
  deleteHandler,
};

module.exports = teamController;
