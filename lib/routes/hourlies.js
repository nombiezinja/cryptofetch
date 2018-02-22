const express = require('express');
const router = express.Router();
const ENV = process.env.NODE_ENV;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);

module.exports = (Hourly) => {

  router.get('/:name', (req, res) => {
    const name = req.params.name
    const begin_time = parseInt(req.query.begin_time, 10)
    const end_time = parseInt(req.query.end_time, 10)

    Hourly.retrieveForPeriod(name, begin_time, end_time).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
};