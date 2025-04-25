const matchStatus = Object.freeze({
  Upcoming: 'Upcoming',
  Ongoing: 'Ongoing',
  Completed: 'Completed',
});

const matchType = Object.freeze({
  '1v1': '1v1',
  '2v2': '2v2',
  '3v3': '3v3',
  '4v4': '4v4',
  '5v5': '5v5',
});

module.exports = {
  matchStatus,
  matchType,
};