/* eslint-disable no-console */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Team = require('../modules/teams/team.model');
const Match = require('../modules/matches/match.model');
const MatchEvent = require('../modules/matches/events/matchEvent.model');

// Game structure
const QUARTER_DURATION_MINUTES = 10; // Standard FIBA duration
const NUM_QUARTERS = 4;
const SHOT_CLOCK_SECONDS = 24;

// Event types
const EVENT_TYPES = {
  SCORE_2: { name: '2-Point Score', probability: 0.3, points: 2 },
  SCORE_3: { name: '3-Point Score', probability: 0.2, points: 3 },
  FREE_THROW: { name: 'Free Throw', probability: 0.15, points: 1 },
  FOUL: { name: 'Foul', probability: 0.1, points: 0 },
  TURNOVER: { name: 'Turnover', probability: 0.1, points: 0 },
  STEAL: { name: 'Steal', probability: 0.05, points: 0 },
  BLOCK: { name: 'Block', probability: 0.05, points: 0 },
  REBOUND: { name: 'Rebound', probability: 0.15, points: 0 },
  ASSIST: { name: 'Assist', probability: 0.2, points: 0 }
};

// Generate a random player from a team roster
function getRandomPlayer(team) {
  if (!team || !team.roster || team.roster.length === 0) return null;
  const rosterIndex = Math.floor(Math.random() * team.roster.length);
  const playerId = team.roster[rosterIndex].player;
  return playerId;
}

// Simulate a single event
function simulateEvent(matchId, gameTime, possessionTeam, otherTeam) {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (const eventType in EVENT_TYPES) {
    cumulativeProbability += EVENT_TYPES[eventType].probability;
    if (rand <= cumulativeProbability) {
      const playerId = getRandomPlayer(possessionTeam);
      const event = {
        match: matchId,
        time: gameTime,
        team: possessionTeam._id,
        player: playerId,
        type: EVENT_TYPES[eventType].name,
        points: EVENT_TYPES[eventType].points,
        details: {
          foulType: eventType === EVENT_TYPES.FOUL ? 'Personal' : null,
          shotType: eventType === EVENT_TYPES.SCORE_2 ? 'Jump Shot' : eventType === EVENT_TYPES.SCORE_3 ? 'Three-Point' : null,
          reboundType: eventType === EVENT_TYPES.REBOUND ? 'Offensive' : null,
          outcome: eventType === EVENT_TYPES.FOUL ? 'Missed' : eventType === EVENT_TYPES.SCORE_2 || eventType === EVENT_TYPES.SCORE_3 ? 'Made' : null,
          assistedPlayer: eventType === EVENT_TYPES.ASSIST ? playerId : null
        }
      };
      // Additional context for specific events
      if (eventType === EVENT_TYPES.FOUL) {
        const fouledPlayerId = getRandomPlayer(otherTeam);
        event.details.fouledPlayer = fouledPlayerId;
      } else if (eventType === EVENT_TYPES.ASSIST) {
        const assistedPlayerId = getRandomPlayer(possessionTeam);
        event.details.assistedPlayer = assistedPlayerId;
      } else if (eventType === EVENT_TYPES.TURNOVER || eventType === EVENT_TYPES.STEAL) {
        const otherTeamPlayerId = getRandomPlayer(otherTeam);
        event.details.otherTeamPlayer = otherTeamPlayerId;
      }
      return { event, changesPossession: eventType === EVENT_TYPES.TURNOVER || eventType === EVENT_TYPES.STEAL };
    }
  }
  return { event: null, changesPossession: false };
}

// Simulate the game
async function simulateGame(matchId, homeTeam, awayTeam) {
  let gameEvents = [];
  let score = { [homeTeam._id.toString()]: 0, [awayTeam._id.toString()]: 0 };
  let possessionTeam = homeTeam;
  let gameTime = 0;

  for (let quarter = 1; quarter <= NUM_QUARTERS; quarter++) {
    const quarterStart = gameTime;
    const quarterEnd = quarterStart + QUARTER_DURATION_MINUTES * 60;

    while (gameTime < quarterEnd) {
      // Simulate events roughly every shot clock duration
      gameTime += SHOT_CLOCK_SECONDS;
      if (gameTime > quarterEnd) gameTime = quarterEnd;

      const otherTeam = possessionTeam._id.toString() === homeTeam._id.toString() ? awayTeam : homeTeam;
      const { event, changesPossession } = simulateEvent(matchId, `Q${quarter} ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}`, possessionTeam, otherTeam);
      if (event) {
        gameEvents.push(event);
        score[possessionTeam._id.toString()] += event.points;
        if (changesPossession) {
          possessionTeam = otherTeam;
        }
      }
    }

    // Log quarter summary
    console.log(`End of Quarter ${quarter}: ${homeTeam.name} ${score[homeTeam._id.toString()]} - ${awayTeam.name} ${score[awayTeam._id.toString()]}`);
  }

  return { events: gameEvents, finalScore: score };
}

// Save events to database
async function saveEventsToDatabase(events) {
  const savedEvents = await MatchEvent.insertMany(events);
  console.log(`Saved ${savedEvents.length} match events to database.`);
  return savedEvents;
}

// Create a match between two teams
async function createMatch(homeTeam, awayTeam) {
  const match = new Match({
    homeTeam: homeTeam._id,
    awayTeam: awayTeam._id,
    date: new Date(),
    status: 'Completed',
    gameType: '5v5'
  });
  const savedMatch = await match.save();
  console.log(`Created match between ${homeTeam.name} and ${awayTeam.name}.`);
  return savedMatch;
}

// Main function to run simulation
async function main() {
  await connectDb();
  try {
    // Clear old match events
    await MatchEvent.deleteMany({});
    console.log('Old match events cleared.');

    // Fetch teams from database
    const teams = await Team.find();
    if (teams.length < 2) {
      throw new Error('Not enough teams in database to simulate a match. Need at least 2 teams.');
    }
    console.log(`Fetched ${teams.length} teams from database.`);

    // Select two random teams for the match
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam._id.toString() === homeTeam._id.toString()) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }

    // Create a match
    const match = await createMatch(homeTeam, awayTeam);

    // Simulate game
    const gameData = await simulateGame(match._id, homeTeam, awayTeam);
    console.log('Final Score:', `${homeTeam.name} ${gameData.finalScore[homeTeam._id.toString()]} - ${awayTeam.name} ${gameData.finalScore[awayTeam._id.toString()]}`);

    // Save events to database
    await saveEventsToDatabase(gameData.events);

    process.exit(0);
  } catch (err) {
    console.error('Error simulating game:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main();
}
