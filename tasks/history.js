const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const request = require('request');
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper')

const fetchCrypto = (coinId, coinName) => {
  const startTime = moment(moment.utc().startOf('day')).unix();
  const interval = 86400;
  const endTime = startTime - interval * 365 * 3;

  times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push(i);
  }


  const getData = async(time) => {
    try {
      const priceResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`);
      const priceJson = await priceResponse.json();
      if (priceJson[coinId.toUpperCase()].USD == 0 && priceJso[coinID.toUpperCase()].BTC == 0) {
        return false;
      }
      dbHelper.saveHistory(coinId, coinName, time, priceJson).then((id) => {
        console.log(`Saved db entry ${id}`)
      })
    } catch (error) {
      console.log(error);
    }
    return true;
  };



  const getDataSeveralTimes = async(times) => {
    if (times.length === 0) {
      return;
    }
    var nextTime = times.shift();
    var keepGoing = await getData(nextTime);
    if (keepGoing) {
      setTimeout(() => getDataSeveralTimes(times), 5000);
    }
  }

  getDataSeveralTimes(times);


  // times.forEach((time, j) => {
  //   setTimeout(function () {
  //     getData(time)
  //   }, 3000 * (j + 1))
  // });

}

const fetchCryptoOpen = () => {
  // openingHour = timeHelper.getUtcOpeningTime(i)
  // openTime = time - closingHour * 85400

  // const openResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${openTime}`);
  // const openJson = await openResponse.json();


}

const fetchCryptoClose = () => {
  // closeTime = time + closingHour * 86400 - 1
  // closingHour = timeHelper.getUtcClosingTime(i)
  // const closeResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${closeTime}`);
  // const closeJson = await closeResponse.json();

}

const fetchCoinCap = () => {
  console.log('This is running')
  return request("http://coincap.io/history/ETH", (error, response, body) => {
    console.log(body);
    return body;
  });
};

module.exports = {
  fetchCrypto: fetchCrypto,
  fetchCoinCap: fetchCoinCap
};