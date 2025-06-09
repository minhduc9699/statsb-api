const Team = require('./team.model');
const Player = require('../players/player.model');

const create = async (team) => {
  team.roster.forEach(r => {
    Player.findOneAndUpdate({ _id: r.player }, { $addToSet: { teams: team._id } }, { new: true });
  });
  return Team.create({ ...team });
};

const get = async (filter, limit=10, page=1) => {
  const count = await Team.countDocuments(filter);
  const teams = await Team.find(filter)
    .populate('roster.player')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .lean();
  return { teams, count };
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
  team.roster.forEach(r => {
    Player.findOneAndUpdate({ _id: r.player }, { $addToSet: { teams: team._id } }, { new: true });
  });
  return Team.findByIdAndUpdate(id, team, { new: true }).populate('roster.player').lean();
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
