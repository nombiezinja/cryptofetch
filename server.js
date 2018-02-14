require('dotenv').config({silent: true})

var ENV = process.env.NODE_ENV 
const port = process.env.PORT || 8080;
const express = require('express');
const bodyParser = require('body-parser');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');
const request = require('request');
const moment = require('moment')
const schedule = require('node-schedule');
const app = express();
const server = http.createServer(app);

const dbHelper = require('./helpers/dbHelper')(knex)
const hourlyFetch = require("./tasks/hourlyFetch");
const dailyFetch = require("./tasks/dailyFetch");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

app.use(knexLogger(knex));

app.set('view engine', 'ejs');

//scheduled at 3 minutes past hour to allow data delay from CryptoCompare api
const hourlySchedule = schedule.scheduleJob('3 * * * *', function () {
  hourlyFetch.fetchHourlyData()
});

const dailySchedule = schedule.scheduleJob('3 12 * * *', function () {
  dailyFetch.fetchDailyData()
});

app.get('/test', (req, res) => {
  hourlyFetch.fetchHourlyData()
})

app.get('/history/:id', (req, res) => {
  dbHelper.retrieveHistories(req.params.id).then((results) => {
    res.send(results);
  }).catch((error) => {
    res.send(error)
  })
});

app.get('/daily/:id', (req, res) => {
  dbHelper.retrieveDailies(req.params.id).then((results) => {
    res.send(results);
  }).catch((error) => {
    res.send(error)
  })
});

app.get('/currenthour/:id', (req, res) => {
  dbHelper.retrieveCurrentHour(req.params.id).then((results) => {
    res.send(results);
  }).catch((error) => {
    res.send(error)
  })
});

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});