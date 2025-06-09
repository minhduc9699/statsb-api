const mongoose = require('mongoose');
const { position } = require('./player.enum');
const { Schema } = mongoose;

const playerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  height: Number,
  weight: Number,
  position: [{ type: String, enum: Object.values(position) }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
}, { timestamps: true, versionKey: false });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
