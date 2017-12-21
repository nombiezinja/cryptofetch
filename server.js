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

const timeHelper = require.main.require('./helpers/timeHelper')
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

const currencies = [{
    coinId: 'btc',
    coinName: 'Bitcoin'
  },
  {
    coinId: 'eth',
    coinName: 'Ethereum'
  }
  // {
  //   coinId: 'neo',
  //   coinName: 'NEO'
  // },
  // {
  //   coinId: 'gas',
  //   coinName: 'GAS'
  // },
  // {
  //   coinId: 'ltc',
  //   coinName: 'Litecoin'
  // },
  // {
  //   coinId: 'lsk',
  //   coinName: 'Lisk'
  // },
  // {
  //   coinId: 'xmr',
  //   coinName: 'Monero XMR'
  // },
  // {
  //   coinId: 'ark',
  //   coinName: 'Ark'
  // },
  // {
  //   coinId: 'iot',
  //   coinName: 'Iota'
  // },
  // {
  //   coinId: 'omg',
  //   coinName: 'OmiseGO'
  // },
  // {
  //   coinId: 'bch',
  //   coinName: 'Bitcoin Cash'
  // }
]

app.get('/history', (req, res) => {

  let timePromises =  [];
  let constructUrlPromises = [];

  for (c of currencies) {
    console.log(c.coinName)
    const timePromise = new Promise((resolve, reject) => {
      resolve(fetchTasks.arrayOfIdAndTimes(c.coinId, c.coinName))
    })
    timePromises.push(timePromise);
  }
  
  const constructUrl = (coinId, coinName, time) => {
    const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`
    
    return {coinId: coinId, coinName: coinName, time: time, url: url}
  }

  const flatten = (arr) => {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }

  const callFromIdTimes = async () => {
    const idTimes = await Promise.all(timePromises);
    console.log(idTimes)
    const idTimesFlattened = await flatten(idTimes)
    for (idTime of idTimesFlattened) { 
      const constructUrlPromise = (idTimePair) => new Promise((resolve, reject) => {
        resolve(constructUrl(idTime.coinId, idTime.coinName, idTime.time))
      })
      constructUrlPromises.push(constructUrlPromise(idTime));
    }
    const urls = await Promise.all(constructUrlPromises);
    fetchTasks.fetchCrypto(urls);
  }

  callFromIdTimes()

})

app.get('/open', (req, res) => {
  
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchTasks.updateWithOpen(currency.coinId)
    }, 2000 * (j + 1));
  });

})

app.get('/close', (req, res) => {

  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchTasks.updateWithClose(currency.coinId)
    }, 5000 * (j + 1));
  });

});

app.get('/test', (req, res) => {
  fetchTasks.arrayOfTimes('eth')
})

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});