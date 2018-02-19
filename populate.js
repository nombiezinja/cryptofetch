const ENV = process.env.NODE_ENV;
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const daily = require("./helpers/daily");
const hourly = require("./helpers/hourly");
const cryptoCompare = require("./lib/sources/cryptoCompare");

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

currencies.forEach((currency, j) => {
  setTimeout(() => {                           
    cryptoCompare.populateHourly(currency.name, currency.displayName)
  }, 2000 * (j + 1));
});

currencies.forEach((currency, j) => {
  setTimeout(() => {
    cryptoCompare.populateDaily(currency.name, currency.displayName)
  }, 2000 * (j + 1));
});