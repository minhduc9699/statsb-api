/* eslint-disable no-console */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Player = require('../modules/players/player.model');
const Team = require('../modules/teams/team.model');
const { position } = require('../modules/players/player.enum');
const { playerStatus, playerPosition } = require('../modules/teams/team.enum');

const { faker } = require('@faker-js/faker'); // v7+ API

const NUM_PLAYERS = 20;
const NUM_TEAMS = 5;
const PLAYERS_PER_TEAM = 5;

function getRandomEnumValue(enumObj) {
  const values = Object.values(enumObj);
  return values[Math.floor(Math.random() * values.length)];
}

async function createMockPlayers() {
  const players = [];
  for (let i = 0; i < NUM_PLAYERS; i++) {
    players.push({
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      position: [getRandomEnumValue(position)],
    });
  }
  return Player.insertMany(players);
}

async function createMockTeams(playerDocs) {
  const teams = [];
  let usedPlayers = 0;
  for (let i = 0; i < NUM_TEAMS; i++) {
    const roster = [];
    for (let j = 0; j < PLAYERS_PER_TEAM; j++) {
      if (usedPlayers >= playerDocs.length) break;
      roster.push({
        player: playerDocs[usedPlayers]._id,
        position: getRandomEnumValue(playerPosition),
        status: getRandomEnumValue(playerStatus),
        jerseyNumber: faker.number.int({ min: 0, max: 99 }),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
      });
      usedPlayers++;
    }
    teams.push({
      name: faker.company.name(),
      avatar: faker.image.avatar(),
      roster,
    });
  }
  return Team.insertMany(teams);
}

(async () => {
  await connectDb();
  try {
    await Player.deleteMany({});
    await Team.deleteMany({});
    console.log('Old data cleared.');

    const players = await createMockPlayers();
    console.log(`Created ${players.length} players.`);

    const teams = await createMockTeams(players);
    console.log(`Created ${teams.length} teams.`);

    process.exit(0);
  } catch (err) {
    console.error('Error creating mock data:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
