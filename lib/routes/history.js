const express = require('express');
const router = express.Router();

module.exports = (History) => {

  router.get("/:id", (req, res) => {
    History.retrieveHistories(req.params.id).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error)
    })
  })
  
  return router
}