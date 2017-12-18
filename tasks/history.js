const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
const request = require('request');
const dbHelper = require.main.require('./helpers/dbHelper')(knex);

const fetchCrypto = (time) => {
  const results = request(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=BTC,USD&ts=${time}`, (error, response, body) => {
    dbHelper.saveHistory(body)
    .then(console.log('done'));
  });
}

const fetchCryptoHigh = (time) => {
  
}

const fetchCoinCap = () => {
  console.log('This is running')
  return request("http://coincap.io/history/ETH", (error, response, body)=> {
    console.log(body);
    return body;
  });
};
    
module.exports = {
  fetchCrypto: fetchCrypto, 
  fetchCoinCap: fetchCoinCap
};

  

