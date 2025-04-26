const Match = require('./match.model');

const create = async (match) => {
  return Match.create({ ...match }).lean();
};

const get = async (filter) => {
  const matches = await Match.find(filter).lean();
  return matches;
};

const getOne = async (filter) => {
  const match = await Match.findOne(filter).populate('teams').lean();
  return match;
};

const getById = async (id) => {
  const match = await Match.findById(id).populate('teams').lean();
  return match;
};

const update = async (id, match) => {
  return Match.findByIdAndUpdate(id, match, { new: true }).lean();
};

const remove = async (id) => {
  return Match.findByIdAndDelete(id).lean();
};

const matchService = {
  create,
  get,
  getOne,
  getById,
  update,
  remove,
};

module.exports = matchService;