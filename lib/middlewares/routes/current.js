const express = require('express');
const router = express.Router();
const cryptoCompare = require('../../sources/cryptoCompare');
const currencies = require('../../data/currencies');
const moment = require('moment');

module.exports = (paramsMiddleware) => {
  
  // this route is used by market watch api current hour fetch task, and is written
  // in a way that minimize code changes in the current build of market
  // watch api. this is a temporary solution.
  router.get('/:name',paramsMiddleware,(req, res) => {
    cryptoCompare.getCurrentData(req.params.name).then((results) => {
      const data = {
        name: req.params.name,
        display_name: currencies[currencies.findIndex(x => x.name == req.params.name)].displayName,
        unix_time: moment().unix(),
        utc_date_time: moment.utc(),
        price_usd: results.data['RAW'][req.params.name.toUpperCase()]['USD']['PRICE'],
        price_btc: results.data['RAW'][req.params.name.toUpperCase()]['BTC']['PRICE'],
        open_usd: results.data['RAW'][req.params.name.toUpperCase()]['USD']['PRICE'],
        close_usd: results.data['RAW'][req.params.name.toUpperCase()]['USD']['PRICE'],
        open_btc: results.data['RAW'][req.params.name.toUpperCase()]['BTC']['PRICE'],
        close_btc: results.data['RAW'][req.params.name.toUpperCase()]['BTC']['PRICE'],
        high_usd: results.data['RAW'][req.params.name.toUpperCase()]['USD']['PRICE'],
        low_usd: results.data['RAW'][req.params.name.toUpperCase()]['USD']['PRICE'],
        high_btc: results.data['RAW'][req.params.name.toUpperCase()]['BTC']['PRICE'],
        low_btc: results.data['RAW'][req.params.name.toUpperCase()]['BTC']['PRICE'],
      }
      res.send(data);
    }).catch((error) => {
      res.sendStatus(500);
    })
  })

  return router;
};