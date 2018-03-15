const express = require('express');
const router = express.Router();
const cryptoCompare = require('../sources/cryptoCompare');

module.exports = (Hourly) => {

  router.get('/:name', (req, res) => {
    cryptoCompare.getCurrentData(req.params.name).then((results) => {
      res.send(results.data);
    }).catch((error) => {
      res.sendStatus(500);
    })
  })

  return router;
};