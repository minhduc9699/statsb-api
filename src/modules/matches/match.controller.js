const matchService = require('./match.service');
const MatchEvent = require('./events/matchEvent.model');
const matchStatsService = require('./stats/matchStats.service');
const { INTERNAL_SERVER_ERROR } = require('../../utils/errors');
const logger = require('../../utils/logger');

const createHandler = async (req, res) => {
  try {
    const data = req.body;
    const newMatch = await matchService.create(data);
    return res.status(201).json({
      message: 'Match created successfully',
      data: newMatch,
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const getHandler = async (req, res) => {
  try {
    const filter = req.query;
    const matches = await matchService.get(filter);
    const matchesWithStats = await Promise.all(matches.map(async match => {
      const matchStats = await matchStatsService.getMatchStats(match._id);
      return {
        ...match,
        teamStats: matchStats ? matchStats.teamStats : {},
        playerStats: matchStats ? matchStats.playerStats : {},
      };
    }));

    return res.status(200).json({
      message: 'Matches fetched successfully',
      data: matchesWithStats,
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const getOneHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const match = await matchService.getOne(id);
    const matchStats = await matchStatsService.getMatchStats(match._id);
    return res.status(200).json({
      message: 'Match fetched successfully',
      data: {
        ...match,
        teamStats: matchStats ? matchStats.teamStats : {},
        playerStats: matchStats ? matchStats.playerStats : {},
        timelineEvents: matchStats ? matchStats.timelineEvents : [],
      },
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const updateHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedMatch = await matchService.update(id, data);
    return res.status(200).json({
      message: 'Match updated successfully',
      data: updatedMatch,
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMatch = await matchService.remove(id);
    return res.status(200).json({
      message: 'Match deleted successfully',
      data: deletedMatch,
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

const batchCalculateStatsHandler = async (req, res) => {
  try {
    const filter = req.query;
    const matches = await matchService.get(filter);
    const matchesWithStats = await Promise.all(matches.map(async match => {
      const events = await MatchEvent.find({ match: match._id })
        .populate('team')
        .populate('player')
        .populate('details.assistedPlayer')
        .populate('details.fouledPlayer')
        .populate('details.otherTeamPlayer');

      const homeStats = matchStatsService.calculateTeamStats(events, match.homeTeam._id);
      const awayStats = matchStatsService.calculateTeamStats(events, match.awayTeam._id);
      const homePlayerStats = matchStatsService.calculatePlayerStats(events, match.homeTeam._id);
      const awayPlayerStats = matchStatsService.calculatePlayerStats(events, match.awayTeam._id);

      const updatedMatchStats = await matchStatsService.updateMatchStats(match._id, {
        teamStats: {
          home: homeStats,
          away: awayStats
        },
        playerStats: {
          home: homePlayerStats,
          away: awayPlayerStats
        },
        timelineEvents: events.map(event => ({
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
        }))
      });
      return {
        ...match,
        teamStats: updatedMatchStats ? updatedMatchStats.teamStats : {},
        playerStats: updatedMatchStats ? updatedMatchStats.playerStats : {},
        timelineEvents: updatedMatchStats ? updatedMatchStats.timelineEvents : [],
      };
    }));

    return res.status(200).json({
      message: 'Matches stats updated successfully',
      data: matchesWithStats,
    });
  } catch (error) {
    logger.error('Error in match controller:', error);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
}


const matchController = {
  createHandler,
  getHandler,
  getOneHandler,
  updateHandler,
  deleteHandler,
  batchCalculateStatsHandler,
};

module.exports = matchController;
