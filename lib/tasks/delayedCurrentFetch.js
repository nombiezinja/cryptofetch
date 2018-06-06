const ENV = process.env.NODE_ENV;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);

const DelayedCurrent = require('../../lib/models/DelayedCurrent')(knex);
const currencies = require('../../lib/data/currencies');
const cryptoCompare = require('../../lib/sources/cryptoCompare');

/*** NOTE: MAX ACCEPTED BASE CURRENCY QUERY STRING IS ~25 TOKENS PER CALL***/
/*** WHEN CURRENCY LIST GROWS TO 25+, NEED TO BREAK INTO SEPARATE CALLS ***/
const buildBaseCurrencyQueryString = () => {
  let baseQs = '';
  currencies.forEach((currency, index, array) => {
    baseQs += currency.name;
    if (index !== array.length - 1) {
      baseQs += ',';
    }
  });
  return baseQs;
};

const fetchData = async (baseCurrency) => {
  // Currently we only quote in BTC and USD, should be changed later
  const quotedCurrency = 'BTC,USD';
  const {error, response} = await cryptoCompare.getCurrentDataFromBaseToQuoted(baseCurrency, quotedCurrency);

  if (error) {
    console.log(error);
  }

  if (response) {
    return {response};
  }
};

const fetchDataEveryIntervalInMillisec = async (interval) => {

  const baseQs = buildBaseCurrencyQueryString();
  /* Rate limit is 100,000 calls/hr, setting a delay of 37
  milliseconds per call ensures it does not exceed limit: 
  1000millisecs / 37 = 27 calls/sec * 60secs = 1620 calls/min
  * 60mins = 97,200 calls/hr max */
  if (interval < 37) {
    interval = 37;
  }

  // If database is empty, insert, else update on a schedule
  if (await DelayedCurrent.isEmpty()) {
    console.log('Fetching and inserting delayed_current data.');

    const {response} = await fetchData(baseQs);

    if (response) {
      DelayedCurrent.insert(response);
    }
  }

  setInterval(async () => {
    console.log('Fetching and updating delayed_current data.');

    const {response} = await fetchData(baseQs);

    if (response) {
      DelayedCurrent.update(response);
    }
  }, interval);
};

module.exports = {
  fetchDataEveryIntervalInMillisec
};