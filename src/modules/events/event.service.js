const Event = require('./event.model');

const create = async (event) => {
  return Event.create({ ...event }).lean();
};

const get = async (filter) => {
  const events = await Event.find(filter).lean();
  return events;
};

const getOne = async (filter) => {
  const event = await Event.findOne(filter).populate('teams').lean();
  return event;
};

const getById = async (id) => {
  const event = await Event.findById(id).populate('teams').lean();
  return event;
};

const update = async (id, event) => {
  return Event.findByIdAndUpdate(id, event, { new: true }).lean();
};

const remove = async (id) => {
  return Event.findByIdAndDelete(id).lean();
};

const eventService = {
  create,
  get,
  getOne,
  getById,
  update,
  remove,
};

module.exports = eventService;