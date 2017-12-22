const ENV = process.env.ENV || "development";
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper')

const arrayOfIdAndTimes = async(coinId, coinName) => {

  const startTime = moment(moment.utc()).unix()

  const interval = 3600;
  const endTime = startTime - 86400;

  let times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push({
      coinId: coinId,
      coinName: coinName,
      time: i
    });
  }
  console.log(times)
  return times
}

module.exports = {
  arrayOfIdAndTimes: arrayOfIdAndTimes
};