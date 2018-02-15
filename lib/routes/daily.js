const express = require('express');
const router = express.Router();

module.exports = (dbHelper) => {

  router.get("/:id", (req, res) => {
    dbHelper.retrieveDailies(req.params.id).then((results) => {
      res.send(results);
    }).catch((error) => {
      res.send(error)
    })
  })

  return router
}