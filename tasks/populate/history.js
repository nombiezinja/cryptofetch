const ENV = process.env.ENV || "development";
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper')

const arrayOfTimes = async(coinId) => {

  const startTime = await timeHelper.getStartTime(coinId)
  const numberOfDays = await timeHelper.numberOfDays(startTime)
  const interval = 86400;
  const endTime = startTime - interval * numberOfDays;

  let times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push(i);
  }

  return times
}

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

const arrayOfTimesForUpdate = async(coinId) => {

  const startTime = await timeHelper.getStartTime(coinId);
  const endTime = await timeHelper.getEndTime(coinId);
  const interval = 86400;

  console.log('starttime', startTime, 'endtime', endTime)
  let times = [];

  i = startTime;
  for (let i = startTime; i <= endTime; i += interval) {
    times.push(i);
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
        dbHelper.saveHistory(fetchObject.coinId, fetchObject.coinName, fetchObject.time, priceJson).then((id) => {
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

const fetchCryptoUpdate = (time, coinId) => {

  const getData = async(time) => {
    try {
      const response = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`);
      const json = await response.json();
      console.log('json', json)
      return json
    } catch (error) {
      console.log(error);
    }
  };

  return getData(time)
};

const updateWithOpen = async(coinId) => {

  const times = await arrayOfTimesForUpdate(coinId)

  times.forEach((time, j) => {
    setTimeout(() => {
      console.log(time, coinId)
      const openingHour = timeHelper.getUtcOpeningTime(time);
      const openTime = time - (12 - openingHour) * 3600;
      const fetchPromise = fetchCryptoUpdate(openTime, coinId);
      fetchPromise.then((result) => {
        dbHelper.updateHistoryWithOpen(time, result, coinId).then((id) => {
          console.log(`db entry ${id} updated`);
        });
      })
    }, 3000 * (j + 1));
  });

};

const updateWithClose = async(coinId) => {

  const times = await arrayOfTimesForUpdate(coinId);

  times.forEach((time, j) => {
    setTimeout(() => {
      const closingHour = timeHelper.getUtcClosingTime(time)
      const closingTime = time + closingHour * 3600;
      const fetchPromise = fetchCryptoUpdate(closingTime, coinId);
      fetchPromise.then((result) => {
        dbHelper.updateHistoryWithClose(time, result, coinId).then((id) => {
          console.log(`db entry ${id} updated`)
        });
      })
    }, 3000 * (j + 1));
  })
}

const fetchCryptoClose = (recordId, coinId, time) => {
  closingHour = timeHelper.getUtcClosingTime(i)
  closeTime = time + closingHour * 86400 - 1

  const getData = async(time) => {
    try {
      const closeResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${closeTime}`);
      const closeJson = await closeResponse.json();
      dbHelper.updateHistoryWithClose(recordId, coinId, closeJson).then(() => {
        console.log(`Updated db entry ${id}`)
      })
    } catch (error) {
      console.log(error);
    }
  };

  getData(time);

};

module.exports = {
  fetchCrypto: fetchCrypto,
  fetchCryptoUpdate: fetchCryptoUpdate,
  fetchCryptoClose: fetchCryptoClose,
  updateWithOpen: updateWithOpen,
  updateWithClose: updateWithClose,
  arrayOfTimes: arrayOfTimes,
  arrayOfIdAndTimes: arrayOfIdAndTimes
};