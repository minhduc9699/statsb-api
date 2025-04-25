const eventType = Object.freeze({
  foul: 'Foul',
  shot: 'Shot',
  rebound: 'Rebound',
  assist: 'Assist',
  turnover: 'Turnover',
  block: 'Block',
  steal: 'Steal',
});

const foulType = Object.freeze({
  personal: 'Personal',
  technical: 'Technical',
  flagrant: 'Flagrant',
});

const shotType = Object.freeze({
  twoPoint: '2P',
  threePoint: '3P',
  freeThrow: 'FT',
  layup: '2P',
  dunk: '2P',
});

const reboundType = Object.freeze({
  offensive: 'Offensive',
  defensive: 'Defensive',
});

const outcome = Object.freeze({
  made: 'Made',
  missed: 'Missed',
  blocked: 'Blocked',
});

module.exports = {
  eventType,
  foulType,
  shotType,
  reboundType,
  outcome,
};
