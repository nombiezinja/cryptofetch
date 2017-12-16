const ENV = process.env.ENV || "development";
const express = require('express');
const bodyParser = require('body-parser');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const http = require('http');
const knexLogger = require('knex-logger');


const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(knexLogger(knex));

app.set('view engine', 'ejs');

app.use('/styles', express.static('../styles/'));

app.get('/', (req, res) => {
    res.render('home')
  });
  
server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
  });