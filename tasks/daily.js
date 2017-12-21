const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper')

const arrayOfIdAndTimes = async(coinId, coinName) => {

  const startTime = await timeHelper.getStartTime(coinId)

  const numberOfDays = await timeHelper.numberOfDays(startTime)
  const interval = 86400;
  const endTime = startTime - interval * numberOfDays;

  let times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push({
      coinId: coinId,
      coinName: coinName,
      time: i
    });
  }

  return times
}

module.exports = {
};