const ENV = process.env.ENV || "development";
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const dbHelper = require.main.require('./helpers/dbHelper')(knex);
const timeHelper = require.main.require('./helpers/timeHelper');

const currencies = [{
    coinId: 'btc',
    coinName: 'Bitcoin'
  },
  {
    coinId: 'eth',
    coinName: 'Ethereum'
  },
  {
    coinId: 'neo',
    coinName: 'NEO'
  },
  {
    coinId: 'gas',
    coinName: 'GAS'
  },
  {
    coinId: 'ltc',
    coinName: 'Litecoin'
  },
  {
    coinId: 'lsk',
    coinName: 'Lisk'
  },
  {
    coinId: 'xmr',
    coinName: 'Monero XMR'
  },
  {
    coinId: 'ark',
    coinName: 'Ark'
  },
  {
    coinId: 'iot',
    coinName: 'Iota'
  },
  {
    coinId: 'omg',
    coinName: 'OmiseGO'
  },
  {
    coinId: 'bch',
    coinName: 'Bitcoin Cash'
  }
]


const updateHourlyData = () => {
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchAndSave(currency.coinId, currency.coinName)
    }, 2000 * (j + 1));
  });
}

const getData = async(coinId, coinName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=1&aggregate=1&e=CCCAGG`);
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

const fetchAndSave = async(coinId, coinName) => {

  const btcJson = await getData(coinId, coinName, 'BTC');

  if (btcJson.data) {
    btcJson.data.forEach((entry) => {
      dbHelper.updateDailyBtc(btcJson.coinId, entry).then((id) => {
        console.log(`Entry ${id} saved for ${coinId} at time ${moment.unix(entry.time)} with BTC info`);
      }).catch((err) => {
        console.log(err)
      })
    })
  };

};

module.exports = {
  updateHourlyData: updateHourlyData
};