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

const miscHelper = require.main.require('./helpers/miscHelper')
const dbHelper = require.main.require('./helpers/dbHelper')
const timeHelper = require.main.require('./helpers/timeHelper')
const historyFetch = require("./tasks/populate/history");
const dailyFetch = require("./tasks/populate/daily");

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

app.get('/history', (req, res) => {

  let timePromises =  [];
  let constructUrlPromises = [];

  for (c of currencies) {
    const timePromise = new Promise((resolve, reject) => {
      resolve(historyFetch.arrayOfIdAndTimes(c.coinId, c.coinName))
    })
    timePromises.push(timePromise);
  }
  
  const callFromIdTimes = async () => {
    const idTimes = await Promise.all(timePromises);
    const idTimesFlattened = await new Set(miscHelper.flatten(idTimes))
    for (idTime of idTimesFlattened) { 
      const constructUrlPromise = (idTimePair) => new Promise((resolve, reject) => {
        resolve(miscHelper.constructUrl(idTime.coinId, idTime.coinName, idTime.time))
      })
      constructUrlPromises.push(constructUrlPromise(idTime));
    }
    const urls = await Promise.all(constructUrlPromises);
    historyFetch.fetchCrypto(urls);
  }

  callFromIdTimes()

})

app.get('/update', (req, res) => {
  
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      historyFetch.fetchUpdate(currency.coinId)
    }, 2000 * (j + 1));
  });

})

app.get('/24hr', (req, res) => {

  currencies.forEach((currency, j) => {
    setTimeout(() => {
      dailyFetch.fetchDaily(currency.coinId, currency.coinName)
    }, 2000 * (j + 1));
  });

})

app.get('/test', (req, res) => {
})

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});