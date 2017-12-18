const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const request = require('request');
const dbHelper = require.main.require('./helpers/dbHelper')(knex);

const fetchCrypto = (time, coinId, coinName) => {
  let newTime = time + 86400
  console.log(coinId);
  console.log(`time is ${time}`)
  const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`;
  const requestPromise = new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

  return requestPromise
    .then((body) => {
      return dbHelper.saveHistory(coinId, coinName, time, JSON.parse(body))
        .then(() => {
          return newTime;
        });
    })
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