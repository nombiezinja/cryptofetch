const moment = require('moment')

module.exports = (knex) => {
  return {
    saveHistory: (coinId, coinName, time, priceResponse) => {
      console.log('priceResponse',priceResponse);
      console.log(moment.utc(moment.unix(time)))
      return knex.table('histories').insert({
        coin_id: coinId,
        display_name: coinName,
        unix_time: time,
        utc_date_time: moment.utc(moment.unix(time)),
        price_usd: priceResponse[coinId.toUpperCase()].USD,
        price_btc: priceResponse[coinId.toUpperCase()].BTC,
        created_at: moment.utc()
      }).returning('id');
    },

    updateUsd: (coinId, response) => {
      console.log('response', response,'coinid', coinId)
      return knex.table('histories')
        .update({
          open_usd: response.open,
          close_usd: response.close,
          volume_usd: response.volumeto, 
        }).where({
          unix_time: response.time, 
          coin_id: coinId
        }).returning('id');
    },

    updateBtc: (coinId, response) => {
      console.log('response', response,'coinid', coinId)
      return knex.table('histories')
        .update({
          open_btc: response.open,
          close_btc: response.close,
          volume_btc: response.volumeto
        }).where({
          unix_time: response.time, 
          coin_id: coinId
        }).returning('id');
    },

    getEarliestEntryTime: (coinId) => {
      return knex.select()
        .from('histories')
        .where({
          coin_id: coinId
        })
        .orderBy('unix_time', 'asc')
        .limit(1)
    },

    getLatestEntryTime: (coinId) => {
      return knex.select()
        .from('histories')
        .where({
          coin_id: coinId
        })
        .orderBy('unix_time', 'desc')
        .limit(1)
    }, 

    checkDuplicate: (coinId, unixTime) => {
      return knex.select()
        .from('histories')
        .where({
          coin_id: coinId,
          unix_time: unixTime
        })
    },

    saveDaily: (coinId, coinName, response) => {
      return knex.table('dailies').insert({
        coin_id: coinId,
        display_name: coinName,
        unix_time: response.time,
        utc_date_time: moment.utc(moment.unix(response.time)),
        price_usd: response.open,
        open_usd: response.open,
        close_usd: response.close,
        volume_usd: response.volumeto,
        created_at: moment.utc()
      }).returning('id');
    },

    updateDailyBtc: (coinId, response) => {
      return knex.table('dailies').update({
        price_btc: response.open, 
        open_btc: response.open, 
        close_btc: response.close,
        volume_btc: response.volumeto
      }).where({
        unix_time: response.time,
        coin_id: coinId
      }).returning('id');
    }

  }

}