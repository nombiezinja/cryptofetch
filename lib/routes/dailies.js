const express = require('express');
const router = express.Router();

module.exports = (Daily) => {

  router.get('/:name', (req, res) => {
    Daily.retrieveAll(req.params.name).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });
  
  return router;
};