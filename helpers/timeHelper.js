const moment = require('moment-timezone')
const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const dbHelper = require.main.require('./helpers/dbHelper')(knex);

const getStartTime = async (coinId) => {
  const promise = await dbHelper.getEarliestEntryTime(coinId)
  const startTime = promise[0] ? promise[0].unix_time - 86400 : moment(moment.utc().startOf('day')).unix();
  return startTime
}

const getEndTime = async(coinId) => {
  const promise = await dbHelper.getLatestEntryTime(coinId);
  const endTime = promise[0] ? promise[0].unix_time : moment(moment.utc().startOf('day')).unix();
  return endTime
}

const numberOfDays = (startTime) => {
  let today = moment(moment.utc().startOf('day')).unix() 
  return 365 * 3 - (today - startTime) / 86400 
}

module.exports = {
  getStartTime: getStartTime, 
  getEndTime: getEndTime,
  numberOfDays: numberOfDays
}    
