const Match = require('../match.model');
const MatchEvent = require('../events/matchEvent.model');
const MatchStats = require('./matchStats.model');
const MatchStatsService = require('./matchStats.service');

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
    const homeTeamStats = MatchStatsService.calculateTeamStats(events, match.homeTeam._id);
    const awayTeamStats = MatchStatsService.calculateTeamStats(events, match.awayTeam._id);

    // Calculate player stats for a team
    const homePlayerStats = MatchStatsService.calculatePlayerStats(events, match.homeTeam._id);
    const awayPlayerStats = MatchStatsService.calculatePlayerStats(events, match.awayTeam._id);

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
    const homeTeamStats = MatchStatsService.calculateTeamStats(events, match.homeTeam._id);
    const awayTeamStats = MatchStatsService.calculateTeamStats(events, match.awayTeam._id);

    // Calculate player stats for a team
    const homePlayerStats = MatchStatsService.calculatePlayerStats(events, match.homeTeam._id);
    const awayPlayerStats = MatchStatsService.calculatePlayerStats(events, match.awayTeam._id);

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
