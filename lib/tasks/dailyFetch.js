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
  const btcJson = await cryptoCompare.getData(name, displayName, 'BTC', 'daily');
  const usdJson = await cryptoCompare.getData(name, displayName, 'USD', 'daily');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      Daily.checkDuplicate(name, entry.time).then((result) => {
        console.log('checking duplicates', result);
        if (!result[0]) {
          Daily.save(usdJson.name, usdJson.displayName, entry).then((id) => {
            console.log(`Entry ${id} saved for ${name} at time ${moment.unix(entry.time)}`);
            if (btcJson.data) {
              console.log('checking duplicates', result);
              btcJson.data.forEach((entry) => {
                Daily.updateWithBtcInfo(btcJson.name, entry).then((id) => {
                  console.log(`Entry ${id} updated for ${name} at time ${moment.unix(entry.time)} with BTC info`);
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