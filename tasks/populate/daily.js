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
  return times
}

const fetchCrypto = async(fetchObjects) => {

  const getData = async(fetchObject) => {
    try {
      const priceResponse = await fetch(fetchObject.url);
      const priceJson = await priceResponse.json();
      console.log(priceJson, 'priceJson')
      if (priceJson[fetchObject.coinId.toUpperCase()].USD == 0 && priceJson[fetchObject.coinId.toUpperCase()].BTC == 0) {
        return false;
      }
      const duplicatePromise = await dbHelper.checkDuplicate(fetchObject.coinId, fetchObject.time)
      if (!duplicatePromise[0]) {
        dbHelper.saveDaily(fetchObject.coinId, fetchObject.coinName, fetchObject.time, priceJson).then((id) => {
          console.log(`Saved db entry ${id} for ${priceJson} and ${fetchObject.time}`)
        })
      } else {
        console.log('Duplicate found, skipping save')
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  };

  const getDataSeveralTimes = async(fetchObjects) => {
    if (fetchObjects.length === 0) {
      return;
    }
    var nextTime = fetchObjects.shift();
    var keepGoing = await getData(nextTime);
    if (keepGoing) {
      setTimeout(() => getDataSeveralTimes(fetchObjects), 1000);
    }
  }

  getDataSeveralTimes(fetchObjects);

}


module.exports = {
  arrayOfIdAndTimes: arrayOfIdAndTimes,
  fetchCrypto: fetchCrypto
};