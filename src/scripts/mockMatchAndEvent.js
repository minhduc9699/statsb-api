/* eslint-disable no-console */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Player = require('../modules/players/player.model');
const Team = require('../modules/teams/team.model');
const Match = require('../modules/matches/match.model');
const Event = require('../modules/events/event.model');
const { matchStatus, matchType } = require('../modules/matches/match.enum');
const { eventType, foulType, shotType, reboundType, outcome } = require('../modules/events/event.enum');

const { faker } = require('@faker-js/faker');

// Configuration constants
const NUM_MATCHES = 10;
const EVENTS_PER_MATCH_MIN = 20;
const EVENTS_PER_MATCH_MAX = 50;

/**
 * Get a random value from an enum object
 * @param {Object} enumObj - The enum object to get a value from
 * @returns {string} A random enum value
 */
function getRandomEnumValue(enumObj) {
  const values = Object.values(enumObj);
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Get random players from a team
 * @param {Object} team - The team document
 * @param {number} count - Number of players to get
 * @returns {Array} Array of player IDs
 */
async function getRandomPlayersFromTeam(team, count = 1) {
  const playerIds = team.roster.map(item => item.player);
  const players = await Player.find({ _id: { $in: playerIds } });
  
  // Shuffle players array
  const shuffled = [...players].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Create mock matches between teams
 * @param {Array} teams - Array of team documents
 * @returns {Promise<Array>} Array of created match documents
 */
async function createMockMatches(teams) {
  if (teams.length < 2) {
    console.error('Need at least 2 teams to create matches');
    return [];
  }

  const matches = [];
  
  for (let i = 0; i < NUM_MATCHES; i++) {
    // Select two random teams
    const shuffledTeams = [...teams].sort(() => 0.5 - Math.random());
    const matchTeams = shuffledTeams.slice(0, 2);
    
    // Create match with random properties
    matches.push({
      teams: matchTeams.map(team => team._id),
      date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }),
      status: getRandomEnumValue(matchStatus),
      gameType: getRandomEnumValue(matchType),
      videoUrl: Math.random() > 0.3 ? faker.internet.url() : null, // 70% chance to have video
    });
  }
  
  return Match.insertMany(matches);
}

/**
 * Generate a random court location
 * @returns {Object} x,y coordinates (0-100 range)
 */
function getRandomCourtLocation() {
  return {
    x: faker.number.int({ min: 0, max: 100 }),
    y: faker.number.int({ min: 0, max: 100 }),
  };
}

/**
 * Create mock events for a match
 * @param {Object} match - Match document
 * @param {Array} teams - Array of team documents
 * @returns {Promise<Array>} Array of created event documents
 */
async function createMockEventsForMatch(match, teams) {
  // Get the two teams in this match
  const matchTeams = teams.filter(team => 
    match.teams.some(teamId => teamId.toString() === team._id.toString())
  );
  
  if (matchTeams.length !== 2) {
    console.error(`Could not find both teams for match ${match._id}`);
    return [];
  }
  
  const events = [];
  const numEvents = faker.number.int({ min: EVENTS_PER_MATCH_MIN, max: EVENTS_PER_MATCH_MAX });
  
  // Generate timestamps for the whole match (assuming 48 minutes = 2880 seconds)
  const gameTime = 2880;
  const usedTimestamps = new Set();
  
  for (let i = 0; i < numEvents; i++) {
    // Select a random team for this event
    const teamIndex = Math.floor(Math.random() * 2);
    const team = matchTeams[teamIndex];
    const opposingTeam = matchTeams[1 - teamIndex];
    
    // Get random players from the team
    const players = await getRandomPlayersFromTeam(team, 2);
    if (!players.length) continue;
    
    // Generate a unique timestamp for this event
    let timestamp;
    do {
      timestamp = faker.number.int({ min: 0, max: gameTime });
    } while (usedTimestamps.has(timestamp));
    usedTimestamps.add(timestamp);
    
    // Select a random event type
    const type = getRandomEnumValue(eventType);
    
    // Create base event
    const event = {
      match: match._id,
      team: team._id,
      player: players[0]._id,
      type,
      comments: Math.random() > 0.7 ? faker.lorem.sentence() : '', // 30% chance to have comments
      timestamps: {
        start: timestamp,
        end: timestamp + faker.number.int({ min: 1, max: 10 }), // 1-10 seconds duration
      },
      details: {
        location: getRandomCourtLocation(),
      },
    };
    
    // Add type-specific details
    switch (type) {
      case eventType.foul:
        event.details.foulType = getRandomEnumValue(foulType);
        break;
        
      case eventType.shot:
        event.details.shotType = getRandomEnumValue(shotType);
        event.details.outcome = getRandomEnumValue(outcome);
        // 30% chance of assist on made shots
        if (event.details.outcome === outcome.made && Math.random() > 0.7 && players.length > 1) {
          event.details.assist = players[1]._id;
        }
        break;
        
      case eventType.rebound:
        event.details.reboundType = getRandomEnumValue(reboundType);
        break;
        
      case eventType.assist:
        // Assist needs a second player
        if (players.length > 1) {
          event.details.assist = players[1]._id;
        }
        break;
        
      // Other event types don't need special handling
    }
    
    events.push(event);
  }
  
  return Event.insertMany(events);
}

/**
 * Main function to create all mock data
 */
async function createMockMatchesAndEvents() {
  // Get existing teams from the database
  const teams = await Team.find({});
  if (teams.length < 2) {
    console.error('Need at least 2 teams in the database. Run mockPlayerAndTeam.js first.');
    return;
  }
  
  // Create matches
  const matches = await createMockMatches(teams);
  console.log(`Created ${matches.length} matches.`);
  
  // Create events for each match
  let totalEvents = 0;
  for (const match of matches) {
    const events = await createMockEventsForMatch(match, teams);
    console.log(`Created ${events.length} events for match ${match._id}.`);
    totalEvents += events.length;
  }
  
  console.log(`Total: ${matches.length} matches and ${totalEvents} events created.`);
}

// Self-executing async function
(async () => {
  await connectDb();
  try {
    // Clear existing data
    await Match.deleteMany({});
    await Event.deleteMany({});
    console.log('Old match and event data cleared.');
    
    await createMockMatchesAndEvents();
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating mock data:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
