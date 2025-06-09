const Match = require('./match.model');

const create = async (match) => {
  return Match.create({ ...match });
};

const get = async (filter, limit=10, page=1) => {
  const count = await Match.countDocuments(filter);
  const matches = await Match.find(filter)
    .populate('homeTeam')
    .populate('awayTeam')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .lean();
  return { matches, count };
};

const getOne = async (filter) => {
  const match = await Match.findOne(filter).populate('homeTeam').populate('awayTeam').lean();
  return match
};

const getById = async (id) => {
  const match = await Match.findById(id).populate('homeTeam').populate('awayTeam').lean();
  return match;
};

const update = async (id, match) => {
  return Match.findByIdAndUpdate(id, match, { new: true }).populate('homeTeam').populate('awayTeam').lean();
};

const remove = async (id) => {
  return Match.findByIdAndDelete(id).populate('homeTeam').populate('awayTeam').lean();
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
