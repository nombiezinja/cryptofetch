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

  const btcJson = await cryptoCompare.getData(name, displayName, 'BTC', 'hourly');
  const usdJson = await cryptoCompare.getData(name, displayName, 'USD', 'hourly');

  if (usdJson.data) {
    console.log('usdJson', usdJson.data);
    usdJson.data.forEach((entry) => {
      Hourly.checkDuplicate(name, entry.time).then((result) => {
        console.log('checking duplicates', result);
        if (!result[0]) {
          console.log(result);
          Hourly.save(usdJson.name, usdJson.displayName, entry).then((id) => {
            console.log(`Entry ${id} saved for ${name} at time ${moment.unix(entry.time)}`);
            Hourly.oldest(name).then((result) => {
              console.log('Oldest entry:', result);
              Hourly.deleteOldest(result[0].id).then(() => {
                console.log(`Oldest entry deleted for ${name}`);
              }).catch((err) => {
                console.log(err);
              });
            }).catch((err) => {
              console.log(err);
            });
            
            if (btcJson.data) {
              console.log('btcJson', btcJson.data);
              btcJson.data.forEach((entry) => {
                Hourly.updateWithBtcInfo(btcJson.name, entry).then((id) => {
                  console.log(`Entry ${id} saved for ${name} at time ${moment.unix(entry.time)} with BTC info`);
                }).catch((err) => {
                  console.log(err);
                });
              });
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          console.log(`Skipping duplicate entry save for ${name}`);
        }
      }).catch((err) => {
        console.log(err);
      });
    });
  }
    
};

module.exports = {
  fetchData: fetchData
};