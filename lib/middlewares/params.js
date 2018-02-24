const paramsMethods = require('../utils/validParams');

module.exports = async (req, res, next) => {
  const validParams = await paramsMethods.checkParams(req.params);
  const validQuery = await paramsMethods.checkQuery(req.query);
  
  if (validParams && validQuery) {
    next();
  } else {
    res.sendStatus(400);
  }
};