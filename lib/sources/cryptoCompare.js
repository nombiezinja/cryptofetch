const ENV = process.env.NODE_ENV 
const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Hourly = require.main.require('./lib/models/Hourly')(knex);
const Daily = require.main.require('./lib/models/Daily')(knex);

const getData = async(coinId, coinName, currency, period) => {
  try {
    const url = `https://min-api.cryptocompare.com/data/histo${period === "daily" ? "day" : "hour"}?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=${period === 'daily' ? 2000 : 168}&aggregate=1&e=CCCAGG`
    // const response = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=2000&aggregate=1&e=CCCAGG`);
    const response = await fetch(url);
    console.log(url)
    // const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=168&aggregate=1&e=CCCAGG`);
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

const populateHourly = async(coinId, coinName) => {

  const btcJson = await getData(coinId, coinName, 'BTC', "hourly");
  const usdJson = await getData(coinId, coinName, 'USD', "hourly");

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      console.log(entry)
      Hourly.save(usdJson.coinId, usdJson.coinName, entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {console.log(err)})
    })
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      console.log(entry)
      Hourly.updateWithBtcInfo(btcJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {console.log(err)})
    })
  }

};


module.exports = {
  populateHourly: populateHourly
}