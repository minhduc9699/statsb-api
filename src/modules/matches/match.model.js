const mongoose = require('mongoose');
const { matchStatus, matchType } = require('./match.enum');
const { Schema } = mongoose;

const matchSchema = new Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  date: Date,
  status: { type: String, enum: Object.values(matchStatus) },
  gameType: { type: String, enum: Object.values(matchType) },
  videoUrl: { type: [
    {
      src: String,
      tag: [String],
    }
  ], default: null },
}, { timestamps: true, versionKey: false });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
