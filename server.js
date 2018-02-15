require('dotenv').config({silent: true})

const ENV = process.env.NODE_ENV 
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
const hourlyFetch = require("./lib/tasks/hourlyFetch");
const dailyFetch = require("./lib/tasks/dailyFetch");

const historyRoutes = require("./lib/routes/history");
const dailyRoutes = require("./lib/routes/daily");
const currentHourRoutes = require("./lib/routes/currentHour");


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

app.use('/history', historyRoutes(dbHelper))
app.use('/daily', dailyRoutes(dbHelper))
app.use('/currenthour', currentHourRoutes(dbHelper))

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});