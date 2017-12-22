const ENV = process.env.ENV || "development";
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper');

const getData = async(coinId, coinName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=2000&aggregate=1&e=CCCAGG`);
    const json = await response.json();
    return {
      coinId: coinId,
      coinName: coinName,
      data: json.Data
    };
  } catch (error) {
    console.log(error);
  }
};

const fetchHistory = async(coinId, coinName) => {

  const btcJson = await getData(coinId, coinName, 'BTC');
  const usdJson = await getData(coinId, coinName, 'USD');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      if (entry.close == 0 && entry.open == 0) {
        return
      }
      dbHelper.saveHistory(usdJson.coinId,usdJson.coinName,entry).then((id) => {
        console.log(`Entry ${id} saved`);
      });
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      dbHelper.updateBtc(btcJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      });
    });
  }

};


module.exports = {
  fetchHistory: fetchHistory
};