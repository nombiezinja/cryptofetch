const moment = require('moment')

module.exports = (knex) => {
  return {
    saveHistory: (coinId, coinName, response) => {
      console.log(response)
      return knex.table('histories').insert({
        coin_id: coinId,
        display_name: coinName,
        unix_time: response.time,
        utc_date_time: moment.utc(moment.unix(response.time)),
        price_usd: response.close,
        volume_usd: response.volumeto,
        open_usd: response.open,
        close_usd: response.close,
        high_usd: response.high,
        low_usd: response.low,
        created_at: moment.utc()
      }).returning('id');
    },

    updateBtc: (coinId, response) => {
      console.log('response', response,'coinid', coinId)
      return knex.table('histories')
        .update({
          price_btc: response.close,
          open_btc: response.open,
          close_btc: response.close,
          volume_btc: response.volumeto,
          high_btc: response.high, 
          low_btc: response.low
        }).where({
          unix_time: response.time, 
          coin_id: coinId
        }).returning('id');
    },

    checkDuplicate: (coinId, unixTime) => {
      return knex.select()
        .from('histories')
        .where({
          coin_id: coinId,
          unix_time: unixTime
        });
    },

    retrieveHistories: (coinId) => {
      return knex('histories')
      .orderBy('unix_time', 'desc')
      .where({coin_id: coinId})
    }
    
  }

}