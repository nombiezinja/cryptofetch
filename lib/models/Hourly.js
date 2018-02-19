const moment = require('moment')

module.exports = (knex) => {
  return {

    save: (name, displayName, response) => {
      return knex.table('hourlies').insert({
        name: name,
        display_name: displayName,
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

    updateWithBtcInfo: (name, response) => {
      return knex.table('hourlies').update({
        price_btc: response.open, 
        open_btc: response.open, 
        close_btc: response.close,
        volume_btc: response.volumeto,
        high_btc: response.high,
        low_btc: response.low
      }).where({
        unix_time: response.time,
        name: name
      }).returning('id');
    },

    checkDuplicate: (name, unixTime) => {
      return knex.select()
        .from('hourlies')
        .where({
          name: name,
          unix_time: unixTime
        });
    },

    oldest: (name) => {
      return knex('hourlies')
      .orderBy('unix_time', 'asc')
      .where({name: name})
      .limit(1);
    },
    
    deleteOldest: (id) => {
      return knex('hourlies')
      .where({id: id})
      .del();
    },

    retrieveAll: (name) => {
      return knex('hourlies')
      .orderBy('unix_time', 'desc')
      .where({name: name});
    }, 
    
    retrieveCurrentHour: (name) => {
      return knex('hourlies')
      .orderBy('unix_time', 'desc')
      .where({name: name})
      .limit(1);
    }
  }

}