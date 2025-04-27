const mongoose = require('mongoose');
const { matchStatus, matchType } = require('./match.enum');
const { Schema } = mongoose;

const matchSchema = new Schema({
  teams: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    validate: {
      validator: (v) => Array.isArray(v) && v.length === 2,
      message: 'Match must have exactly two teams'
    }
  },
  date: Date,
  status: { type: String, enum: Object.values(matchStatus) },
  gameType: { type: String, enum: Object.values(matchType) },
  videoUrl: { type: String, default: null },
}, { timestamps: true, versionKey: false });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
