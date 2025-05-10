const mongoose = require('mongoose');
const { eventType, foulType, shotType, reboundType, outcome } = require('./matchEvent.enum');

const eventSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  type: { type: String, enum: Object.values(eventType) },
  comments: String,
  timestamps: {
    start: String,
    end: String,
  },
  details: {
    foulType: { type: String, enum: Object.values(foulType) },
    shotType: { type: String, enum: Object.values(shotType) },
    reboundType: { type: String, enum: Object.values(reboundType) },
    outcome: { type: String, enum: Object.values(outcome) },
    location: {
      x: Number,
      y: Number,
    },
    fouledPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    assistedPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    otherTeamPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  },
}, { timestamps: true, versionKey: false });

const MatchEvent = mongoose.model('MatchEvent', eventSchema);

module.exports = MatchEvent;
