const ENV = process.env.NODE_ENV;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);
const moment = require('moment-timezone');

const Hourly = require('../../lib/models/Hourly')(knex);
const currencies = require('../../lib/data/currencies');
const cryptoCompare = require('../../lib/sources/cryptoCompare');

const fetchData = () => {
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchAndSave(currency.name, currency.displayName);
    }, 2000 * (j + 1));
  });
};

const fetchAndSave = async(name, displayName) => {

  const newestEntry = await Hourly.retrieveNewest(name);
  let entryNumber;

  if (!newestEntry[0]) {
    console.log('Please run populate.js first');
    return;
  } else {
    entryNumber = Math.round((moment().unix() - newestEntry[0].unix_time) / 3600);
  }

  const btcJson = await cryptoCompare.getData(name, displayName, 'BTC', 'hourly', entryNumber);
  const usdJson = await cryptoCompare.getData(name, displayName, 'USD', 'hourly', entryNumber);
  
  console.log(btcJson);
  console.log(usdJson);

  if(usdJson.data) {
    usdJson.data.forEach(async(entry) => {
      const duplicate = await Hourly.checkDuplicate(name, entry.time);
      if(!duplicate[0]) {
        const saveHourly = await Hourly.save(usdJson.name, usdJson.displayName, entry);
        const oldestEntry = await Hourly.oldest(name);
        const deletedOldest = await Hourly.deleteOldest(oldestEntry[0].id);
      }
      if (btcJson.data) {
        console.log('here is the btcJson data');
        console.log(btcJson.data);
        btcJson.data.forEach( async (entry) => {
          if (entry.open) {
            console.log(`here is a btcJson data entry price${entry.open}`);
          }
          const updatedEntry = await Hourly.updateWithBtcInfo(btcJson.name, entry);
        });
      } else {
        console.log('btcjson not available');
      }
    });
  }

    
};

module.exports = {
  fetchData: fetchData
};