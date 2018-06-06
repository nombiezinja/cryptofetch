const ENV = process.env.NODE_ENV;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);
const moment = require('moment-timezone');

const Daily = require('../../lib/models/Daily')(knex);
const currencies = require('../../lib/data/currencies');
const cryptoCompare = require('../../lib/sources/cryptoCompare');

const fetchData = () => {
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchAndSave(currency.name, currency.displayName);
    }, 2000 * (j + 1));
  });
};

const fetchAndSave = async (name, displayName) => {

  const newestEntry = await Daily.retrieveNewest(name);
  let entryNumber;

  // Determine how many entries to fetch
  // Makes sure this task is only run when populate.js has seeded the database
  // Prevents Javascript Heap out of Memory error by ensuring only small 
  // numbers of entries are fetched at a time
  if (!newestEntry[0]) {
    console.log('Please run populate.js first');
    return;
  } else {
    entryNumber = Math.round((moment().unix() - newestEntry[0].unix_time) / 86400);
  }

  // Get price data for token in USD
  const usdJson = await cryptoCompare.getData(name, displayName, 'USD', 'daily', entryNumber);
  
  if (usdJson.data) {
    usdJson.data.forEach(async (entry) => {
      const duplicate = await Daily.checkDuplicate(name, entry.time);
      if (!duplicate[0]) {
        // returns unix time stamp for saved entry
        const savedDaily = await Daily.save(usdJson.name, usdJson.displayName, entry);
        const btcJson = await cryptoCompare.getData(name, displayName, 'BTC', 'daily', savedDaily[0]);
        if (btcJson.data) {
          btcJson.data.forEach(async (entry) => {
            const updatedDaily = await Daily.updateWithBtcInfo(btcJson.name, entry);
          });
        }
      }
    });

  }


};

module.exports = {
  fetchData: fetchData
};