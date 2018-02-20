const cryptoCompare = require('./lib/sources/cryptoCompare');
const currencies = require('./lib/data/currencies');

currencies.forEach((currency, j) => {
  setTimeout(() => {                           
    cryptoCompare.populateHourly(currency.name, currency.displayName);
  }, 2000 * (j + 1));
  setTimeout(() => {
    cryptoCompare.populateDaily(currency.name, currency.displayName);
  }, 2000 * (j + 1));
});
