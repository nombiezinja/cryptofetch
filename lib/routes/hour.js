const express = require('express');
const router = express.Router();

module.exports = (Hourly) => {

  router.get('/:id', (req, res) => {
    Hourly.retrieveCurrentHour(req.params.id).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
};