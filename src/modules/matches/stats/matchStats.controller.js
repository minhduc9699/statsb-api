const Match = require('../match.model');
const MatchEvent = require('../events/matchEvent.model');
const MatchStats = require('./matchStats.model');
const { eventType } = require('../events/matchEvent.enum');

// Get detailed stats for a specific match
exports.getMatchStats = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId)
      .populate('homeTeam')
      .populate('awayTeam');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if stats already exist for this match
    const existingStats = await MatchStats.findOne({ match: matchId });
    if (existingStats) {
      return res.status(200).json(existingStats);
    }

    const events = await MatchEvent.find({ match: matchId })
      .populate('team')
      .populate('player')
      .populate('details.assistedPlayer')
      .populate('details.fouledPlayer')
      .populate('details.otherTeamPlayer');

    // Calculate team stats
    const calculateTeamStats = (teamId) => {
      const teamEvents = events.filter(event => event.team._id.toString() === teamId.toString());
      const points = teamEvents.reduce((sum, event) => {
        if (event.type === eventType.SCORE_2) return sum + 2;
        if (event.type === eventType.SCORE_3) return sum + 3;
        if (event.type === eventType.FREE_THROW) return sum + 1;
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

    const homeTeamStats = calculateTeamStats(match.homeTeam._id);
    const awayTeamStats = calculateTeamStats(match.awayTeam._id);

    // Calculate player stats for a team
    const calculatePlayerStats = (teamId) => {
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

    const homePlayerStats = calculatePlayerStats(match.homeTeam._id);
    const awayPlayerStats = calculatePlayerStats(match.awayTeam._id);

    // Game timeline events
    const timelineEvents = events
      .sort((a, b) => a.timestamps.start - b.timestamps.start)
      .map(event => ({
        time: event.timestamps.start,
        team: event.team.name,
        player: event.player.name,
        eventType: event.type,
        details: {
          outcome: event.details.outcome || '',
          foulType: event.details.foulType || '',
          shotType: event.details.shotType || '',
          reboundType: event.details.reboundType || '',
          assistedPlayer: event.details.assistedPlayer ? event.details.assistedPlayer.name : '',
          fouledPlayer: event.details.fouledPlayer ? event.details.fouledPlayer.name : '',
          otherTeamPlayer: event.details.otherTeamPlayer ? event.details.otherTeamPlayer.name : ''
        }
      }));

    const matchStats = {
      match: matchId,
      matchDetails: {
        id: match._id,
        homeTeam: {
          id: match.homeTeam._id,
          name: match.homeTeam.name,
          avatar: match.homeTeam.avatar
        },
        awayTeam: {
          id: match.awayTeam._id,
          name: match.awayTeam.name,
          avatar: match.awayTeam.avatar
        },
        date: match.date,
        status: match.status
      },
      teamStats: {
        home: homeTeamStats,
        away: awayTeamStats
      },
      playerStats: {
        home: homePlayerStats,
        away: awayPlayerStats
      },
      timelineEvents
    };

    // Save to MatchStats collection
    const savedStats = await new MatchStats(matchStats).save();
    console.log(`Saved match stats for match ${matchId}`);

    return res.status(200).json(savedStats);
  } catch (error) {
    console.error('Error fetching match stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Recalculate and update stats for a match
exports.updateMatchStats = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId)
      .populate('homeTeam')
      .populate('awayTeam');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const events = await MatchEvent.find({ match: matchId })
      .populate('team')
      .populate('player')
      .populate('details.assistedPlayer')
      .populate('details.fouledPlayer')
      .populate('details.otherTeamPlayer');

    // Calculate team stats
    const calculateTeamStats = (teamId) => {
      const teamEvents = events.filter(event => event.team._id.toString() === teamId.toString());
      const points = teamEvents.reduce((sum, event) => {
        if (event.type === eventType.SCORE_2) return sum + 2;
        if (event.type === eventType.SCORE_3) return sum + 3;
        if (event.type === eventType.FREE_THROW) return sum + 1;
        return sum;
      }, 0);
      const fieldGoals = teamEvents.filter(event => event.type === eventType.SCORE_2 || event.type === eventType.SCORE_3).length;
      const fieldGoalAttempts = teamEvents.filter(event => event.type.includes('Score')).length;
      const threePointers = teamEvents.filter(event => event.type === eventType.SCORE_3).length;
      const freeThrows = teamEvents.filter(event => event.type === eventType.FREE_THROW).length;
      const rebounds = teamEvents.filter(event => event.type === eventType.REBOUND).length;
      const assists = teamEvents.filter(event => event.type === eventType.ASSIST).length;
      const turnovers = teamEvents.filter(event => event.type === EVENT_TYPES.TURNOVER).length;
      const steals = teamEvents.filter(event => event.type === EVENT_TYPES.STEAL).length;
      const blocks = teamEvents.filter(event => event.type === EVENT_TYPES.BLOCK).length;
      const fouls = teamEvents.filter(event => event.type === EVENT_TYPES.FOUL).length;

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

    const homeTeamStats = calculateTeamStats(match.homeTeam._id);
    const awayTeamStats = calculateTeamStats(match.awayTeam._id);

    // Calculate player stats for a team
    const calculatePlayerStats = (teamId) => {
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

        if (event.type === EVENT_TYPES.TWO_POINT_SCORE) playerStats[playerId].points += 2;
        if (event.type === EVENT_TYPES.THREE_POINT_SCORE) playerStats[playerId].points += 3;
        if (event.type === EVENT_TYPES.FREE_THROW) playerStats[playerId].points += 1;
        if (event.type === EVENT_TYPES.REBOUND) playerStats[playerId].rebounds += 1;
        if (event.type === EVENT_TYPES.ASSIST) playerStats[playerId].assists += 1;
        if (event.type === EVENT_TYPES.STEAL) playerStats[playerId].steals += 1;
        if (event.type === EVENT_TYPES.BLOCK) playerStats[playerId].blocks += 1;
        if (event.type === EVENT_TYPES.TURNOVER) playerStats[playerId].turnovers += 1;
        if (event.type === EVENT_TYPES.FOUL) playerStats[playerId].fouls += 1;
      });

      return Object.values(playerStats).sort((a, b) => b.points - a.points);
    };

    const homePlayerStats = calculatePlayerStats(match.homeTeam._id);
    const awayPlayerStats = calculatePlayerStats(match.awayTeam._id);

    // Game timeline events
    const timelineEvents = events
      .sort((a, b) => a.timestamps.start - b.timestamps.start)
      .map(event => ({
        time: event.timestamps.start,
        team: event.team.name,
        player: event.player.name,
        eventType: event.type,
        details: {
          outcome: event.details.outcome || '',
          foulType: event.details.foulType || '',
          shotType: event.details.shotType || '',
          reboundType: event.details.reboundType || '',
          assistedPlayer: event.details.assistedPlayer ? event.details.assistedPlayer.name : '',
          fouledPlayer: event.details.fouledPlayer ? event.details.fouledPlayer.name : '',
          otherTeamPlayer: event.details.otherTeamPlayer ? event.details.otherTeamPlayer.name : ''
        }
      }));

    const matchStats = {
      match: matchId,
      matchDetails: {
        id: match._id,
        homeTeam: {
          id: match.homeTeam._id,
          name: match.homeTeam.name,
          avatar: match.homeTeam.avatar
        },
        awayTeam: {
          id: match.awayTeam._id,
          name: match.awayTeam.name,
          avatar: match.awayTeam.avatar
        },
        date: match.date,
        status: match.status
      },
      teamStats: {
        home: homeTeamStats,
        away: awayTeamStats
      },
      playerStats: {
        home: homePlayerStats,
        away: awayPlayerStats
      },
      timelineEvents
    };

    // Update or create in MatchStats collection
    const updatedStats = await MatchStats.findOneAndUpdate(
      { match: matchId },
      matchStats,
      { upsert: true, new: true }
    );
    console.log(`Updated match stats for match ${matchId}`);

    return res.status(200).json(updatedStats);
  } catch (error) {
    console.error('Error updating match stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
