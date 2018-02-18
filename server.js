require('dotenv').config({silent: true})

const ENV = process.env.NODE_ENV; 
const port = process.env.PORT || 8080;
const express = require('express');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');
const request = require('request');
const moment = require('moment');
const schedule = require('node-schedule');
const app = express();
const server = http.createServer(app);

const Hourly = require('./lib/models/Hourly')(knex);
const Daily = require('./lib/models/Daily')(knex);

const hourlyFetch = require("./lib/tasks/hourlyFetch");
const dailyFetch = require("./lib/tasks/dailyFetch");

const hourliesRoutes = require("./lib/routes/hourlies");
const dailiesRoutes = require("./lib/routes/dailies");
const hourRoutes = require("./lib/routes/hour");

app.use(morgan('dev'));

app.use(knexLogger(knex));

//scheduled at 3 minutes past hour to allow data delay from CryptoCompare api
const hourlySchedule = schedule.scheduleJob('3 * * * *', function () {
  hourlyFetch.fetchHourlyData();
});

const dailySchedule = schedule.scheduleJob('3 12 * * *', function () {
  dailyFetch.fetchDailyData();
});

app.get('/test1', (req, res) => {
  hourlyFetch.fetchHourlyData();
})

app.get('/test2', (req, res) => {
  dailyFetch.fetchDailyData();
})


app.use('/dailies', dailiesRoutes(Daily));
app.use('/hourlies', hourliesRoutes(Hourly));
app.use('/hour', hourRoutes(Hourly));

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

module.exports = server