const ENV = process.env.NODE_ENV 
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const dailyFetch = require("./helpers/daily");
const hourlyFetch = require("./helpers/hourly");

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

currencies.forEach((currency, j) => {
  setTimeout(() => {                           
    dailyFetch.fetchHistory(currency.coinId, currency.coinName)
  }, 2000 * (j + 1));
});

currencies.forEach((currency, j) => {
  setTimeout(() => {
    hourlyFetch.fetchDaily(currency.coinId, currency.coinName)
  }, 2000 * (j + 1));
});