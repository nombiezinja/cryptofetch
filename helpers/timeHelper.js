const moment = require('moment-timezone')
const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const dbHelper = require.main.require('./helpers/dbHelper')(knex);

const newYorkIsDst = (unixTime) => {
  return moment.tz(moment(moment.unix(unixTime)).utc(), 'america_new_york').isDST()
}

const getUtcClosingTime = (unixTime) => {
  if (newYorkIsDst(unixTime)){
    return 21
  } else {
    return 22
  }
}

const getUtcOpeningTime = (unixTime) => {
  if (newYorkIsDst(unixTime)){
    return 9
  } else {
    return 10
  }
}

const getOpenTime = (unixTime) => {
  const openingHour = timeHelper.getUtcOpeningTime(unixTime)
  const openTime = unixTime - (12 - openingHour) * 85400
  console.log ('ppening hour',openingHour, 'opentime', oopenTIme)
  return openTime
}

const getStartTime = async (coinId) => {
  const promise = await dbHelper.getEarliestEntryTime(coinId)
  const startTime = promise[0] ? promise[0].unix_time : moment(moment.utc().startOf('day')).unix();
  return startTime
}

const getEndTime = async(coinId) => {
  const promise = await dbHelper.getLatestEntryTime(coinId);
  const endTime = promise[0] ? promise[0].unix_time : moment(moment.utc().startOf('day')).unix();
  return endTime
}

const numberOfDays = (startTime) => {
  today = moment(moment.utc().startOf('day')).unix() 
  return 365 * 3 - (today - startTime) / 86400 
}

module.exports = {
  getUtcClosingTime: getUtcClosingTime,
  getUtcOpeningTime: getUtcOpeningTime, 
  getOpenTime: getOpenTime, 
  getStartTime: getStartTime, 
  getEndTime: getEndTime,
  numberOfDays: numberOfDays
}    
