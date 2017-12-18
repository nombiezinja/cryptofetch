const ENV = process.env.ENV || "development";
const express = require('express');
const bodyParser = require('body-parser');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');
const request = require('request');

const app = express();
const server = http.createServer(app);

const fetchTasks = require("./tasks/history");

app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(knexLogger(knex));

app.set('view engine', 'ejs');

app.use('/styles', express.static('../styles/'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/history', (req, res) => {
  const time = '1513584000';
  const test = fetchTasks.fetchCrypto(time);
  res.send(test);
})



server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
  });