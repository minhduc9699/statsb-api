const mongoose = require('mongoose');

const matchStatsSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', unique: true },
  matchDetails: {
    id: mongoose.Schema.Types.ObjectId,
    homeTeam: {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      avatar: String
    },
    awayTeam: {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      avatar: String
    },
    date: Date,
    status: String
  },
  teamStats: {
    home: {
      points: Number,
      fieldGoals: Number,
      fieldGoalAttempts: Number,
      fieldGoalPercentage: Number,
      threePointers: Number,
      freeThrows: Number,
      rebounds: Number,
      assists: Number,
      turnovers: Number,
      steals: Number,
      blocks: Number,
      fouls: Number
    },
    away: {
      points: Number,
      fieldGoals: Number,
      fieldGoalAttempts: Number,
      fieldGoalPercentage: Number,
      threePointers: Number,
      freeThrows: Number,
      rebounds: Number,
      assists: Number,
      turnovers: Number,
      steals: Number,
      blocks: Number,
      fouls: Number
    }
  },
  playerStats: {
    home: [{
      name: String,
      points: Number,
      rebounds: Number,
      assists: Number,
      steals: Number,
      blocks: Number,
      turnovers: Number,
      fouls: Number
    }],
    away: [{
      name: String,
      points: Number,
      rebounds: Number,
      assists: Number,
      steals: Number,
      blocks: Number,
      turnovers: Number,
      fouls: Number
    }]
  },
  timelineEvents: [{
    time: Number,
    team: String,
    player: String,
    eventType: String,
    details: {
      outcome: String,
      foulType: String,
      shotType: String,
      reboundType: String,
      assist: String
    }
  }]
}, { timestamps: true, versionKey: false });

const MatchStats = mongoose.model('MatchStats', matchStatsSchema);

module.exports = MatchStats;
