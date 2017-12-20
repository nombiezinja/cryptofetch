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
      closingHour = timeHelper.getUtcClosingTime(i)
      openingHour = timeHelper.getUtcOpeningTime(i)
      closeTime = time + closingHour * 86400 - 1
      openTime = time - closingHour * 85400
      const priceResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`);
      const priceJson = await priceResponse.json();
      if (priceJson[coinId.toUpperCase()].USD == 0 && priceJso[coinID.toUpperCase()].BTC == 0) {
        // go find all other getDatas for this coinId/coinname, that have a greater time, and cancel them from running
        return false; // time to fuck off and stop hassling the API about this particular coin
      }
      const openResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${openTime}`);
      const openJson = await openResponse.json();
      const closeResponse = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${closeTime}`);
      const closeJson = await closeResponse.json();
      dbHelper.saveHistory(coinId, coinName, time, priceJson, openJson, closeJson).then((id) => {
        console.log(`Saved db entry ${id}`)
      })
    } catch (error) {
      console.log(error);
    }
    return true;   // true means "as far as I know there are more results"
  };


  // for (var i in times) {

  // }

  // let remain be the number left to do
  // call a helper with the arguments, plus also pass "remain"
  // in the helper, if remain is 0, stop
  //    else, run the code above,
  //    if getData returns some kind of "fuck off" signal, fuck off
  //    else, queue up another run of this helper, for a few seconds in the future, with "remain" decremented

  async function getDataSeveralTimes(times) {
    if (times.length === 0) {
      return;
    }
    var nextTime = times.shift();
    var keepGoing = await getData(nextTime);
    if (keepGoing) {
      setTimeout(()=>getDataSeveralTimes(times), 5000);
    }
  }
  getDataSeveralTimes(times);


  // times.forEach((time, j) => {
  //   setTimeout(function () {
  //     getData(time)
  //   }, 3000 * (j + 1))
  // });

}

const fetchCryptoHigh = (time) => {

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