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

  times = []

  for (let i = startTime; i >= endTime; i -= interval) {
    times.push(i)
  }

  async function fetch(times) {
    const promises = times.map(time => request(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`, (error, response, body) => {
    })).then((body) => dbHelper.saveHistory(coinId, coinName, time, JSON.parse(body)))
    const response = await Promise.all(promises)
  }

  fetch(times)
}
// const fetchCrypto = (coinId, coinName) => {
//   // console.log(moment(moment.utc().startOf('day')).unix())
//   const startTime = moment(moment.utc().startOf('day')).unix();
//   // const endTime = startTime - 86400 * 1095
//   const endTime = startTime - 86400 * 30;
//   const interval = 86400;

//   const promises = [];


//   for (let i = startTime; i >= endTime; i -= interval){
//     console.log(i, coinId)
//     const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${i}`;

//     const requestPromise = new Promise((resolve, reject) => {
//       request(url, (error, response, body) => {
//         if (error) {
//           reject(error);
//         } else {
//           setTimeout(() => {resolve(body)}, 1000);
//         }
//       });
//     });

//     const savePromise = requestPromise.then((body) => {
//       dbHelper.saveHistory(coinId, coinName, i, JSON.parse(body))
//     })

//     promises.push(savePromise);
//   }


// }

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