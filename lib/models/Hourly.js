const moment = require('moment')

module.exports = (knex) => {
  return {

    save: (coinId, coinName, response) => {
      return knex.table('hourlies').insert({
        name: coinId,
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

    updateWithBtcInfo: (coinId, response) => {
      return knex.table('hourlies').update({
        price_btc: response.open, 
        open_btc: response.open, 
        close_btc: response.close,
        volume_btc: response.volumeto,
        high_btc: response.high,
        low_btc: response.low
      }).where({
        unix_time: response.time,
        name: coinId
      }).returning('id');
    },

    checkDuplicate: (coinId, unixTime) => {
      return knex.select()
        .from('hourlies')
        .where({
          name: coinId,
          unix_time: unixTime
        });
    },

    oldest: (coinId) => {
      return knex('hourlies')
      .orderBy('unix_time', 'asc')
      .where({name: coinId})
      .limit(1);
    },
    
    deleteOldest: (id) => {
      return knex('hourlies')
      .where({id: id})
      .del();
    },

    retrieveAll: (coinId) => {
      return knex('hourlies')
      .orderBy('unix_time', 'desc')
      .where({name: coinId});
    }, 
    
    retrieveCurrentHour: (coinId) => {
      return knex('hourlies')
      .orderBy('unix_time', 'desc')
      .where({name: coinId})
      .limit(1);
    }
  }

}