const mongoose = require('mongoose');
const { eventType, foulType, shotType, reboundType, outcome } = require('./event.enum');

const eventSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  type: { type: String, enum: Object.values(eventType) },
  details: {
    foulType: { type: String, enum: Object.values(foulType) },
    shotType: { type: String, enum: Object.values(shotType) },
    reboundType: { type: String, enum: Object.values(reboundType) },
    outcome: { type: String, enum: Object.values(outcome) },
    location: {
      x: Number,
      y: Number,
    },
    assist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  comments: String,
  timestamps: Number,
}, { timestamps: true, versionKey: false });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
