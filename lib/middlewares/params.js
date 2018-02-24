const express = require('express');
const router = express.Router();
const paramsValidator = require('../utils/validParams');

module.exports = async (req, res, next) => {
  console.log(req.params, "here's params in middleware")
  console.log(req.query, "here's query in middleware")

  const validParams = await paramsValidator.checkParams(req.params);
  const validQuery = await paramsValidator.checkQuery(req.query);
  // const validParams = true
  // const validQuery = true
  
  console.log(validParams)
  console.log(validQuery)

  if (validParams && validQuery) {
    next();
  } else {
    res.sendStatus(400);
  }

};