const Team = require('./team.model');

const create = async (team) => {
  return Team.create({ ...team }).lean();
};

const get = async (filter) => {
  const teams = await Team.find(filter).lean();
  return teams;
};

const getOne = async (filter) => {
  const team = await Team.findOne(filter).populate('roster.player').lean();
  return team;
};

const getById = async (id) => {
  const team = await Team.findById(id).populate('roster.player').lean();
  return team;
};

const update = async (id, team) => {
  return Team.findByIdAndUpdate(id, team, { new: true }).lean();
};

const remove = async (id) => {
  return Team.findByIdAndDelete(id).lean();
};

const teamService = {
  create,
  get,
  getOne,
  getById,
  update,
  remove,
};

module.exports = teamService;