const mongoose = require('mongoose');
const { matchStatus, matchType } = require('./match.enum');
const { Schema } = mongoose;

const matchSchema = new Schema({
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', limit: 2 }],
  date: Date,
  status: { type: String, enum: Object.values(matchStatus) },
  gameType: { type: String, enum: Object.values(matchType) },
}, { timestamps: true, versionKey: false });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
