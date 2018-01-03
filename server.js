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
const schedule = require('node-schedule');
const app = express();
const server = http.createServer(app);

const dbHelper = require('./helpers/dbHelper')(knex)
const hourlyFetch = require("./tasks/hourlyFetch");
const dailyFetch = require("./tasks/dailyFetch");
const hourlyUpdate= require("./tasks/hourlyUpdate");
const dailyUpdate = require("./tasks/dailyUpdate");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

app.use(knexLogger(knex));

app.set('view engine', 'ejs');

app.use('/styles', express.static('../styles/'));

const hourlySchedule1 = schedule.scheduleJob('0 * * * *', function () {
  hourlyFetch.fetchHourlyData()
});

const hourlySchedule2 = schedule.scheduleJob('1 * * * *', function () {
  hourlyUpdate.updateHourlyData()
});


const dailySchedule1 = schedule.scheduleJob('0 12 * * *', function () {
  dailyFetch.fetchDailyData()
});

const dailySchedule2 = schedule.scheduleJob('1 12 * * *', function () {
  dailyUpdate.updateDailyData()
});


app.get('/test', (req, res) => {
  dailyFetch.fetchDailyData()
});

app.get('/testb', (req, res) => {
  hourlyUpdate.updateHourlyData()
});

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

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});