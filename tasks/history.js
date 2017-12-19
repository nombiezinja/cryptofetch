const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const request = require('request');
const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const moment = require('moment');
const fetch = require('node-fetch');

const fetchCrypto = (coinId, coinName) => {
  const startTime = moment(moment.utc().startOf('day')).unix();
  const interval = 86400;
  const endTime = startTime - interval * 30;

  times = [];

  i = startTime;
  for (let i = startTime; i >= endTime; i -= interval) {
    times.push(i);
  }
  
  
  const getData = async(url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      dbHelper.saveHistory(coinId, coinName, i, json).then((id) => {
        console.log(`Saved db entry ${id}`)
      })
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(times)
  j = 0
  times.forEach((time, j) => { 
    setTimeout(function (){getData(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`)}, 3000*(j+1)) 
  });

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