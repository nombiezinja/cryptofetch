const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (paramsMiddleware, Hourly) => {

  router.get('/:name',paramsMiddleware, (req, res) => {
    const name = req.params.name;
    
    let begin_time;
    let end_time; 

    if (req.query.timestamp) {
      // Get unix time for closest full hour
      begin_time = Math.round(parseInt(req.query.timestamp, 10) / 3600) * 3600;
      // if begin time hasn't ocurred yet, use prev hour
      if (begin_time + 300 >= moment().unix()) {
        begin_time = begin_time - 3600
      } 
      end_time = begin_time;
    } else {
      begin_time = parseInt(req.query.begin_time, 10) || 0;
      end_time = parseInt(req.query.end_time, 10) || moment().unix();
    }

    Hourly.retrieveForPeriod(name, begin_time, end_time, req.query.order).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  router.get('/:name/oldest',paramsMiddleware, (req, res) =>{
    Hourly.retrieveOldest(req.params.name).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
};