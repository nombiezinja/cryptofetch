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

  // for (const currency in currencies) {
  //   fetchTasks.fetchCrypto(currency, currencies[currency])
  // }
  let j = 0
  currencies.forEach((currency, j) => {
    setTimeout(function () {
      fetchTasks.fetchCrypto(currency.coinId, currency.coinName)
    }, 5000 * (j + 1))
  });

})

app.get('/test', (req, res) => {
  console.log('hi')
  knex.select().from('histories').then((records) => {
    records.forEach ((record) => {
      console.log(record.unix_time)
    })
  })
})

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});