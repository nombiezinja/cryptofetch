const ENV = process.env.NODE_ENV;
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Daily = require.main.require('./lib/models/Daily')(knex);

const getData = async (name, displayName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${name.toUpperCase()}&tsym=${currency}&limit=2000&aggregate=1&e=CCCAGG`);
    const json = await response.json();
    return {
      name: name,
      displayName: displayName,
      data: json.Data
    };
  } catch (error) {
    console.log(error);
  }
};

const populate = async (name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC');
  const usdJson = await getData(name, displayName, 'USD');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      if (entry.close == 0 && entry.open == 0) {
        return
      }
      Daily.save(usdJson.name, usdJson.displayName, entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {
        console.log(err)
      });
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      Daily.updateWithBtcInfo(btcJson.name, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {
        console.log(err)
      });
    });
  }

};

module.exports = {
  populate: populate
}