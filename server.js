require('dotenv').config({
  silent: true
});

const ENV = process.env.NODE_ENV;
const port = process.env.PORT || 8080;
const express = require('express');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');
const schedule = require('node-schedule');
const app = express();
const moment = require('moment');
const server = http.createServer(app);

const Hourly = require('./lib/models/Hourly')(knex);
const Daily = require('./lib/models/Daily')(knex);

const hourlyFetch = require('./lib/tasks/hourlyFetch');
const dailyFetch = require('./lib/tasks/dailyFetch');

const hourliesRoutes = require('./lib/middlewares/routes/hourlies');
const dailiesRoutes = require('./lib/middlewares/routes/dailies');
const currentRoutes = require('./lib/middlewares/routes/current');

const paramsMiddleware = require('./lib/middlewares/params');

const fs = require('fs');
const path = require('path');

//writing log to file for now, awaiting further instructions on how logging best handled in aws ecosystem
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// app.use(morgan('combined', {
//   stream: accessLogStream
// }));

app.use(morgan('dev'));

app.use(knexLogger(knex));

//scheduled at 3 minutes past hour to allow data delay from CryptoCompare api
const hourlySchedule = schedule.scheduleJob('3 * * * *', function () {
  console.log(`Scheduled hourly data fetch task running at utc time${moment.utc()}`);
  hourlyFetch.fetchData();
});

const dailySchedule = schedule.scheduleJob('3 12 * * *', function () {
  console.log(`Scheduled daily data fetch task running at utc time${moment.utc()}`);
  dailyFetch.fetchData();
});

app.use('/dailies', dailiesRoutes(paramsMiddleware,Daily));
app.use('/hourlies', hourliesRoutes(paramsMiddleware, Hourly));
app.use('/current', currentRoutes(paramsMiddleware));

app.get('/test1', (req, res) => {
  hourlyFetch.fetchData();
});

// app.get('/test2', (req, res) => {
//   dailyFetch.fetchData();
// });

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

module.exports = server;