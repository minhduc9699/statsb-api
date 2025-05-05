const eventService = require('./event.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');

const createHandler = async (req, res) => {
  try {
    const data = req.body;
    const newEvent = await eventService.create(data);
    return res.status(201).json({
      message: 'Event created successfully',
      data: newEvent,
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
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const filter = {...req.query};
    delete filter.page;
    delete filter.limit;
    const events = await eventService.get(filter, page, limit);
    return res.status(200).json({
      message: 'Events fetched successfully',
      data: events,
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
    const event = await eventService.getOne(id);
    return res.status(200).json({
      message: 'Event fetched successfully',
      data: event,
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
    const updatedEvent = await eventService.update(id, data);
    return res.status(200).json({
      message: 'Event updated successfully',
      data: updatedEvent,
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
    const deletedEvent = await eventService.remove(id);
    return res.status(200).json({
      message: 'Event deleted successfully',
      data: deletedEvent,
    });
  } catch (error) {
    logger.error(error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const eventController = {
  createHandler,
  getHandler,
  getOneHandler,
  updateHandler,
  deleteHandler,
};

module.exports = eventController;
