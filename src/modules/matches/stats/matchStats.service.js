const MatchStats = require('./matchStats.model');
const { eventType } = require('../events/matchEvent.enum');


const getMatchStats = async (matchId) => {
  const matchStats = await MatchStats.findOne({ match: matchId.toString() });
  return matchStats;
}

const createMatchStats = async (matchId) => {
  const matchStats = await MatchStats.create({ match: matchId.toString() });
  return matchStats;
}

const updateMatchStats = async (matchId, matchStats) => {
  const updatedMatchStats = await MatchStats.findOneAndUpdate({ match: matchId.toString() }, matchStats, { new: true, upsert: true }).exec();
  return updatedMatchStats;
}

const deleteMatchStats = async (matchId) => {
  const deletedMatchStats = await MatchStats.findOneAndDelete({ match: matchId.toString() });
  return deletedMatchStats;
}

const calculateTeamStats = (events, teamId) => {
  const teamEvents = events.filter(event => event.team._id.toString() === teamId.toString());
  const points = teamEvents.reduce((sum, event) => {
    if (event.type === eventType.SCORE_2 && event.details.outcome === 'Made') return sum + 2;
    if (event.type === eventType.SCORE_3 && event.details.outcome === 'Made') return sum + 3;
    if (event.type === eventType.FREE_THROW && event.details.outcome === 'Made') return sum + 1;
    return sum;
  }, 0);
  const fieldGoals = teamEvents.filter(event => event.type === eventType.SCORE_2 || event.type === eventType.SCORE_3).length;
  const fieldGoalAttempts = teamEvents.filter(event => event.type.includes('Score')).length;
  const threePointers = teamEvents.filter(event => event.type === eventType.SCORE_3).length;
  const freeThrows = teamEvents.filter(event => event.type === eventType.FREE_THROW).length;
  const rebounds = teamEvents.filter(event => event.type === eventType.REBOUND).length;
  const assists = teamEvents.filter(event => event.type === eventType.ASSIST).length;
  const turnovers = teamEvents.filter(event => event.type === eventType.TURNOVER).length;
  const steals = teamEvents.filter(event => event.type === eventType.STEAL).length;
  const blocks = teamEvents.filter(event => event.type === eventType.BLOCK).length;
  const fouls = teamEvents.filter(event => event.type === eventType.FOUL).length;

  return {
    points,
    fieldGoals,
    fieldGoalAttempts,
    fieldGoalPercentage: fieldGoalAttempts > 0 ? ((fieldGoals / fieldGoalAttempts) * 100).toFixed(1) : 0,
    threePointers,
    freeThrows,
    rebounds,
    assists,
    turnovers,
    steals,
    blocks,
    fouls
  };
};

const calculatePlayerStats = (events, teamId) => {
  const teamEvents = events.filter(event => event.team._id.toString() === teamId.toString());
  const playerStats = {};

  teamEvents.forEach(event => {
    const playerId = event.player._id.toString();
    if (!playerStats[playerId]) {
      playerStats[playerId] = {
        name: event.player.name,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0
      };
    }

    if (event.type === eventType.SCORE_2) playerStats[playerId].points += 2;
    if (event.type === eventType.SCORE_3) playerStats[playerId].points += 3;
    if (event.type === eventType.FREE_THROW) playerStats[playerId].points += 1;
    if (event.type === eventType.REBOUND) playerStats[playerId].rebounds += 1;
    if (event.type === eventType.ASSIST) playerStats[playerId].assists += 1;
    if (event.type === eventType.STEAL) playerStats[playerId].steals += 1;
    if (event.type === eventType.BLOCK) playerStats[playerId].blocks += 1;
    if (event.type === eventType.TURNOVER) playerStats[playerId].turnovers += 1;
    if (event.type === eventType.FOUL) playerStats[playerId].fouls += 1;
  });

  return Object.values(playerStats).sort((a, b) => b.points - a.points);
};

module.exports = {
  getMatchStats,
  createMatchStats,
  updateMatchStats,
  deleteMatchStats,
  calculateTeamStats,
  calculatePlayerStats
}
