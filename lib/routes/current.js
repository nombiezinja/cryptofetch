const express = require('express');
const router = express.Router();
const cryptoCompare = require('../sources/cryptoCompare');

module.exports = (Hourly) => {

  router.get('/hour/:name', (req, res) => {
    Hourly.retrieveCurrentHour(req.params.name).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  router.get('/:name', (req, res) => {
    cryptoCompare.getCurrentData('eth').then((results) => {
      res.send(results.data);
    }).catch((error) => {
      res.send(error);
    })
  })

  return router;
};