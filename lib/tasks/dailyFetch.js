const ENV = process.env.NODE_ENV 
const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Daily = require('../../lib/models/Daily')(knex);

const currencies = [{
    name: 'btc',
    displayName: 'Bitcoin'
  },
  {
    name: 'eth',
    displayName: 'Ethereum'
  },
  {
    name: 'neo',
    displayName: 'NEO'
  },
  {
    name: 'gas',
    displayName: 'GAS'
  },
  {
    name: 'ltc',
    displayName: 'Litecoin'
  },
  {
    name: 'lsk',
    displayName: 'Lisk'
  },
  {
    name: 'xmr',
    displayName: 'Monero XMR'
  },
  {
    name: 'ark',
    displayName: 'Ark'
  },
  {
    name: 'iot',
    displayName: 'Iota'
  },
  {
    name: 'omg',
    displayName: 'OmiseGO'
  },
  {
    name: 'bch',
    displayName: 'Bitcoin Cash'
  }
]

const fetchData = () => {
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchAndSave(currency.name, currency.displayName);
    }, 2000 * (j + 1));
  });
}

const getData = async(name, displayName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${name.toUpperCase()}&tsym=${currency}&limit=1&aggregate=1&e=CCCAGG`);
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

const fetchAndSave = async(name, displayName) => {

  const btcJson = await getData(name, displayName, 'BTC');
  const usdJson = await getData(name, displayName, 'USD');

  if (usdJson.data) {
    usdJson.data.forEach((entry) => {
      Daily.checkDuplicate(name, entry.time).then((result) => {
        if (!result[0]) {
          Daily.save(usdJson.name, usdJson.displayName, entry).then((id) => {
            console.log(`Entry ${id} saved for ${name} at time ${moment.unix(entry.time)}`);
            if (btcJson.data) {
              btcJson.data.forEach((entry) => {
                Daily.updateWithBtcInfo(btcJson.name, entry).then((id) => {
                  console.log(`Entry ${id} updated for ${name} at time ${moment.unix(entry.time)} with BTC info`);
                }).catch((err) => {
                  console.log(err);
                });
              });
            };
          }).catch((err) => {
            console.log(err);
          })
        } else {
          console.log(`Skipping duplicate entry save for ${name}`);
        }
      }).catch((err) => {
        console.log(err);
      })
    })
  };


};

module.exports = {
  fetchData: fetchData
};