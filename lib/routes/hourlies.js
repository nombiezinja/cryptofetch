const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (Hourly) => {

  router.get('/:name', (req, res) => {
    const name = req.params.name
    const begin_time = parseInt(req.query.begin_time, 10) || 0
    const end_time = parseInt(req.query.end_time, 10) || moment().unix();
    
    Hourly.retrieveForPeriod(name, begin_time, end_time).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
};