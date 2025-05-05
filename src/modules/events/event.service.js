const Event = require('./event.model');

const create = async (event) => {
  return Event.create({ ...event }).lean();
};

const get = async (filter, page = 1, limit = 20) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(limit).lean(),
    Event.countDocuments(filter),
  ]);
  return { data, page, limit, total };
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
