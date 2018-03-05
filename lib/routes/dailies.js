const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (Daily) => {

  router.get('/:name', (req, res) => {
    const name = req.params.name;
    
    let begin_time;
    let end_time; 

    if (req.query.timestamp) {
      // Get unix time for closest full day
      begin_time = Math.round(parseInt(req.query.timestamp, 10) / 86400) * 86400;
      end_time = begin_time;
    } else {
      begin_time = parseInt(req.query.begin_time, 10) || 0;
      end_time = parseInt(req.query.end_time, 10) || moment().unix();
    }

    Daily.retrieveForPeriod(name, begin_time, end_time).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });
  
  return router;
};