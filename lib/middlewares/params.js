const express = require('express');
const router = express.Router();
const paramsValidator = require('../utils/validParams');

module.exports = async (req, res, next) => {

  // const validParams = await paramsValidator.checkParams(req.params);
  // const validQuery = await paramsValidator.checkQuery(req.query);
  const validParams = true
  const validQuery = true
  
  if (validParams && validQuery) {
    next();
  } else {
    res.sendStatus(400);
  }

};