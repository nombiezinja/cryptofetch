const express = require('express');
const router = express.Router();
const ENV = process.env.NODE_ENV; 
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[ENV]);

module.exports = (Hourly) => {

  router.get('/:name', (req, res) => {
    console.log(typeof parseInt(req.query.begin_time, 10))
    // Hourly.retrieveForPeriod(req.params.name, parseInt(req.query.begin_time, 10), parseInt(req.query.end_time, 10)).then((results) => {
    //   res.send(results);
    // }).catch((error) => {
    //   res.send(error);
    // });
    const name = req.params.name
    const begin_time = parseInt(req.query.begin_time, 10)
    const end_time = parseInt(req.query.end_time, 10)
    const statement = `select * from hourlies where name='${name}' and unix_time >= ${begin_time} and unix_time <= ${end_time};`
    console.log(statement)
    knex.raw(statement).then((results) => {
      res.send(results.rows)
    })
    // knex.raw(`select id from hourlies 
    //   where name=${req.params.name} and unix_time >= ${parseInt(req.query.begin_time)} 
    //   and unix_time <= ${parseInt(req.query.end_time)};
    //   `).then((results) => {
    //     console.log(results)
      // })

    // Hourly.retrieveAll(req.params.name).then((results) => {
    //   res.send(results);
    // }).catch((error) => {
    //   res.send(error);
    // });
  });

  return router;
};