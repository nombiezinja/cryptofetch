const ENV = process.env.NODE_ENV 
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Hourly = require.main.require('./lib/models/Hourly')(knex);

const getData = async(name, displayName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${name.toUpperCase()}&tsym=${currency}&limit=168&aggregate=1&e=CCCAGG`);
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

const populate = async(name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC');
  const usdJson = await getData(name, displayName, 'USD');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      console.log(entry)
      Hourly.save(usdJson.name, usdJson.displayName, entry).then((id) => {
        console.log(`Entry ${id} saved`);
      }).catch((err) => {console.log(err)})
    })
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      console.log(entry)
      Hourly.updateWithBtcInfo(btcJson.name, entry).then((id) => {
        console.log(`Entry ${id} updated`);
      }).catch((err) => {console.log(err)})
    })
  }

};


module.exports = {
  populate: populate
}