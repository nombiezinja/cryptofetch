const ENV = process.env.NODE_ENV 
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Daily = require.main.require('./lib/models/Daily')(knex);

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

const fetch = async(coinId, coinName) => {

  const btcJson = await getData(coinId, coinName, 'BTC');
  const usdJson = await getData(coinId, coinName, 'USD');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      if (entry.close == 0 && entry.open == 0) {
        return
      }
      Daily.save(usdJson.coinId,usdJson.coinName,entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {console.log(err)});
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      Daily.updateWithBtcInfo(btcJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {console.log(err)});
    });
  }

};


module.exports = fetch