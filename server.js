const ENV = process.env.ENV || "development";
const express = require('express');
const bodyParser = require('body-parser');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');
const request = require('request');
const moment = require('moment')

const app = express();
const server = http.createServer(app);

const fetchTasks = require("./tasks/history");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

app.use(knexLogger(knex));

app.set('view engine', 'ejs');

app.use('/styles', express.static('../styles/'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/history', (req, res) => {
  const currencies = {
    btc: 'Bitcoin',
    eth: 'Ethereum',
    neo: 'NEO',
    gas: 'GAS',
    ltc: 'Litecoin',
    lsk: 'Lisk',
    xmr: 'Monero XMR',
    ark: 'Ark',
    iot: 'Iota',
    omg: 'OmiseGO',
    bch: 'Bitcoin Cash'
  }

  for (const currency in currencies) {
    fetchTasks.fetchCrypto(currency, currencies[currency])
  }

})



server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});