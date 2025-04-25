const timeToString = (time) => {
  const date = new Date(time);
  const hh = `0${date.getHours()}`.slice(-2);
  const mm = `0${date.getMinutes()}`.slice(-2);
  const ss = `0${date.getSeconds()}`.slice(-2);

  return `${hh}:${mm}:${ss}`;
};

const stringToTime = (timeString) => {
  const [hh, mm, ss] = timeString.split(':').map((str) => parseInt(str, 10));
  return new Date(Date.UTC(1970, 0, 1, hh, mm, ss));
};

const getTimeDiffInString = (startTime, endTime) => {
  const timeDiffMs = stringToTime(endTime).getTime() - stringToTime(startTime).getTime();
  let timeDiff = '00:00:00';
  if (timeDiffMs > 0) {
    const timeDiffMap = [
      Math.floor(timeDiffMs / (60 * 60 * 1000)),
      Math.floor(timeDiffMs / (60 * 1000)) % 60,
      Math.floor(timeDiffMs / 1000) % 60,
    ];
    timeDiff = timeDiffMap.map((item) => `0${item}`.slice(-2)).join(':');
  }
  return timeDiff;
};

module.exports = { timeToString, stringToTime, getTimeDiffInString };
