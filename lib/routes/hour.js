const express = require('express');
const router = express.Router();

module.exports = (Hourly) => {

  router.get('/hour/:name', (req, res) => {
    Hourly.retrieveCurrentHour(req.params.name).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
};