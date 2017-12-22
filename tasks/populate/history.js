const ENV = process.env.ENV || "development";
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper');

const arrayOfTimes = async(coinId) => {

  const startTime = await timeHelper.getStartTime(coinId);
  const numberOfDays = await timeHelper.numberOfDays(startTime);
  const interval = 86400;
  const endTime = startTime - interval * numberOfDays;

  let times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push(i);
  };

  return times;
}

const arrayOfIdAndTimes = async(coinId, coinName) => {

  const startTime = await timeHelper.getStartTime(coinId);

  const numberOfDays = await timeHelper.numberOfDays(startTime);
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
  };

  return times;
}

const numberOfDaysForUpdate = async(coinId) => {

  const startTime = await timeHelper.getStartTime(coinId);
  const endTime = await timeHelper.getEndTime(coinId);
  const interval = 86400;

  const days = (endTime - startTime) / interval;
  return days;
}

const fetchCrypto = async(fetchObjects) => {

  const getData = async(fetchObject) => {
    try {
      const priceResponse = await fetch(fetchObject.url);
      const priceJson = await priceResponse.json();
      console.log(priceJson, 'priceJson');
      if (priceJson[fetchObject.coinId.toUpperCase()].USD == 0 && priceJson[fetchObject.coinId.toUpperCase()].BTC == 0) {
        return false;
      }
      const duplicatePromise = await dbHelper.checkDuplicate(fetchObject.coinId, fetchObject.time);
      if (!duplicatePromise[0]) {
        dbHelper.saveHistory(fetchObject.coinId, fetchObject.coinName, fetchObject.time, priceJson).then((id) => {
          console.log(`Saved db entry ${id} for ${priceJson} and ${fetchObject.time}`);
        });
      } else {
        console.log('Duplicate found, skipping save');
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

const getData = (days, coinId, currency) => {

  const getData = async() => {
    try {
      const response = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=${days}&aggregate=1&e=CCCAGG`);
      const json = await response.json();
      return {
        coinId: coinId,
        data: json.Data
      };
    } catch (error) {
      console.log(error);
    }
  };

  return getData();
};

const fetchUpdate = async(coinId) => {

  const days = await numberOfDaysForUpdate(coinId);
  const updateBtcJson = await getData(days, coinId, 'BTC');
  const updateUsdJson = await getData(days, coinId, 'USD');

  if (updateBtcJson.data) {
    updateBtcJson.data.forEach((entry) => {
      dbHelper.updateBtc(updateBtcJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      })
    })
  }

  if (updateUsdJson.data) {
    updateUsdJson.data.forEach((entry) => {
      dbHelper.updateUsd(updateUsdJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      })
    })
  }

};


module.exports = {
  fetchCrypto: fetchCrypto,
  fetchUpdate: fetchUpdate,
  arrayOfTimes: arrayOfTimes,
  arrayOfIdAndTimes: arrayOfIdAndTimes
};