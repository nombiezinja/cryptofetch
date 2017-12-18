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
  // console.log(moment(moment.utc().startOf('day')).unix())
  const startTime = moment(moment.utc().startOf('day')).unix()
  // const endTime = startTime - 86400 * 1095
  const endTime = startTime - 86400 * 30
  const interval = 86400
  
  let time = startTime

  for (const currency in currencies) {
    console.log(time)
    while (time >= endTime) { 
      const fetchDataPromise = fetchTasks.fetchCrypto(time, currency, currencies[currency])
      fetchDataPromise.then((returnTime) => {
        console.log(`I did this promise thing and the returnTime is ${returnTime}`)
        time = returnTime
      });
    } 
  }

})



server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});