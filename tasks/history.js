const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const request = require('request');
const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const moment = require('moment')

const fetchCrypto = (coinId, coinName) => {
  const startTime = moment(moment.utc().startOf('day')).unix();
  const endTime = startTime - 86400 * 30;
  const interval = 86400;

  const requestPromises = [];

  const delay = (ms) => {
    new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let i = startTime; i >= endTime; i -= interval) {
    console.log(i, coinId)
    const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${i}`;

    const requestPromise = new Promise(async(resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          await delay(3000);
          resolve(body);
        }
      });
    });

    requestPromises.push(requestPromise)
  }
  async function fetch() {
    const responses = await Promise.all(requestPromises)
    console.log(responses)
    // loop through responses here and save to db 
  }

  fetch()

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