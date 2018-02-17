const express = require('express');
const router = express.Router();

module.exports = (Daily) => {

  router.get("/:id", (req, res) => {
    Daily.retrieveDailies(req.params.id).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error);
    });
  });

  return router;
}