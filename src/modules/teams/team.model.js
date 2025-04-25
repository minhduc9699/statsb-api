const mongoose = require('mongoose');
const { Schema } = mongoose;
const { teamStatus, playerPosition } = require('./team.enum');

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  roster: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    position: { type: String, enum: Object.values(playerPosition) },
    status: { type: String, enum: Object.values(teamStatus) },
    jerseyNumber: Number,
    startDate: Date,
    endDate: Date,
  }],
}, { timestamps: true, versionKey: false });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;