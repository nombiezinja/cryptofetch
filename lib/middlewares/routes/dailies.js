const express = require('express');
const router = express.Router();
const moment = require('moment');


module.exports = (paramsMiddleware, Daily) => {
  
  router.get('/:name',paramsMiddleware, (req, res) => {
    const name = req.params.name;
    
    let begin_time;
    let end_time; 

    if (req.query.timestamp) {
      // Get unix time for closest full day
      begin_time = Math.round(parseInt(req.query.timestamp, 10) / 86400) * 86400;
      // if closest full day returned is 12AM of the next day which hasn't ocurred yet, use 12AM of the previous day
      if (begin_time + 300 >= moment().unix()) {
        begin_time = begin_time - 12 * 86400 
      } 
      end_time = begin_time;
    } else {
      begin_time = parseInt(req.query.begin_time, 10) || 0;
      end_time = parseInt(req.query.end_time, 10) || moment().unix();
    }

    Daily.retrieveForPeriod(name, begin_time, end_time, req.query.order).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  router.get('/:name/oldest',paramsMiddleware, (req, res) =>{
    Daily.retrieveOldest(req.params.name).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });
  
  return router;
};