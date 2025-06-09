const Player = require('./player.model');

const create = async (player) => {
  return Player.create({ ...player });
};

const get = async (filter, limit=2, page=1) => {
  const count = await Player.countDocuments(filter);
  const players = await Player
    .find(filter)
    .populate('teams')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .lean();
  return { players, count };
};

const getOne = async (filter) => {
  const player = await Player.findOne(filter).lean();
  return player;
};

const getById = async (id) => {
  const player = await Player.findById(id);
  return player;
};

const update = async (id, player) => {
  return Player.findByIdAndUpdate(id, player, { new: true }).lean();
};

const remove = async (id) => {
  return Player.findByIdAndDelete(id);
};

const playerService = {
  create,
  get,
  getOne,
  getById,
  update,
  remove,
};

module.exports = playerService;
