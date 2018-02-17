const moment = require('moment')

module.exports = (knex) => {
  return {

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
        high_usd: response.high,
        low_usd: response.low,
        created_at: moment.utc()
      }).returning('id');
    },

    updateDailyBtc: (coinId, response) => {
      return knex.table('dailies').update({
        price_btc: response.open, 
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
        .from('dailies')
        .where({
          coin_id: coinId,
          unix_time: unixTime
        });
    },

    oldestDaily: (coinId) => {
      return knex('dailies')
      .orderBy('unix_time', 'asc')
      .where({coin_id: coinId})
      .limit(1)
    },
    
    deleteOldest: (id) => {
      return knex('dailies')
      .where({id: id})
      .del()
    },

    retrieveDailies: (coinId) => {
      return knex('dailies')
      .orderBy('unix_time', 'desc')
      .where({coin_id: coinId})
    }, 
    
    retrieveCurrentHour: (coinId) => {
      return knex('dailies')
      .orderBy('unix_time', 'desc')
      .where({coin_id: coinId})
      .limit(1)
    }
  }

}