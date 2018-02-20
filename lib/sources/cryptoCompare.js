const ENV = process.env.NODE_ENV;
const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Hourly = require.main.require('./lib/models/Hourly')(knex);
const Daily = require.main.require('./lib/models/Daily')(knex);

const constructUrl = (name, displayName, currency, period) => {
  return url = `https://min-api.cryptocompare.com/data/histo${period === "daily" ? "day" : "hour"}?fsym=${name.toUpperCase()}&tsym=${currency}&limit=${period === 'daily' ? 2000 : 168}&aggregate=1&e=CCCAGG`;
}

const getData = async (name, displayName, currency, period) => {
  try {
    const url = await constructUrl(name, displayName, currency, period)
    const response = await fetch(url);
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

const populateHourly = async (name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC', 'hourly');
  const usdJson = await getData(name, displayName, 'USD', 'hourly');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      console.log(entry);
      Hourly.save(usdJson.name, usdJson.displayName, entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {
        console.log(err);
      })
    })
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      console.log(entry);
      Hourly.updateWithBtcInfo(btcJson.name, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {
        console.log(err);
      })
    })
  }

};

const populateDaily = async (name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC', 'daily');
  const usdJson = await getData(name, displayName, 'USD', 'daily');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      if (entry.close == 0 && entry.open == 0) {
        return;
      }
      Daily.save(usdJson.name, usdJson.displayName, entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      Daily.updateWithBtcInfo(btcJson.name, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

};

module.exports = {
  populateHourly: populateHourly,
  populateDaily: populateDaily,
  getData: getData
}