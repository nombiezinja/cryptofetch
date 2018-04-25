const ENV = process.env.NODE_ENV;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);
const fetch = require('node-fetch');

const Hourly = require('../models/Hourly')(knex);
const Daily = require('../models/Daily')(knex);

const constructUrl = (name, displayName, currency, period, entryNumber) => {
  return `https://min-api.cryptocompare.com/data/histo${period === 'daily' ? 'day' : 'hour'}?fsym=${name.toUpperCase()}&tsym=${currency}&limit=${entryNumber}&aggregate=1&e=CCCAGG`;
};

const getData = async (name, displayName, currency, period, entryNumber) => {
  try {
    const url = await constructUrl(name, displayName, currency, period,entryNumber);
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

const getCurrentData = async(name) => {
  const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${name.toUpperCase()}&tsyms=BTC,USD`);
  const json = await response.json();
  return {
    name: name, 
    data: json
  };
};


const getCurrentDataInCurrency = async(name, currency) => {
  const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${name.toUpperCase()}&tsyms=${currency.toUpperCase()}`);
  const json = await response.json();
  return {
    name: name, 
    data: json
  };
};

const populateHourly = async (name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC', 'hourly', 168);
  const usdJson = await getData(name, displayName, 'USD', 'hourly', 168);

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      Hourly.save(usdJson.name, usdJson.displayName, entry).then((id) => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      Hourly.updateWithBtcInfo(btcJson.name, entry).then((id) => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

};

const populateDaily = async (name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC', 'daily', 2000);
  const usdJson = await getData(name, displayName, 'USD', 'daily', 2000);

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      if (entry.close == 0 && entry.open == 0) {
        return;
      }
      Daily.save(usdJson.name, usdJson.displayName, entry).then((id) => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      Daily.updateWithBtcInfo(btcJson.name, entry).then((id) => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

};

module.exports = {
  populateHourly: populateHourly,
  populateDaily: populateDaily,
  getData: getData, 
  getCurrentData: getCurrentData, 
  getCurrentDataInCurrency: getCurrentDataInCurrency
};