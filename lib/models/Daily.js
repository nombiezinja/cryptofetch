const moment = require('moment');

module.exports = (knex) => {
  return {

    save: (name, displayName, response) => {
      // console.log(response);
      return knex.table('dailies').insert({
        name: name,
        display_name: displayName,
        unix_time: response.time,
        utc_date_time: moment.utc(moment.unix(response.time)),
        price_usd: response.close,
        volume_usd: response.volumeto,
        open_usd: response.open,
        close_usd: response.close,
        high_usd: response.high,
        low_usd: response.low,
        created_at: moment.utc()
      }).returning('unix_time');
    },

    updateWithBtcInfo: (name, response) => {
      return knex.table('dailies')
        .update({
          price_btc: response.close,
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
        .from('dailies')
        .where({
          name: name,
          unix_time: unixTime
        });
    },

    retrieveAll: (name) => {
      return knex('dailies')
        .orderBy('unix_time', 'desc')
        .where({
          name: name
        });
    },

    retrieveForPeriod: (name, begin_time, end_time, order) => {
      const orderBy = order ? order : 'desc'
      return knex('dailies')
        .orderBy('unix_time', orderBy)
        .where({
          name
        })
        .andWhere('unix_time', '>=', begin_time)
        .andWhere('unix_time', '<=', end_time);
    },

    retrieveOldest: (name) => {
      return knex('dailies')
        .orderBy('unix_time', 'asc')
        .where({
          name
        })
        .limit(1);
    },

    retrieveNewest: (name) => {
      return knex('dailies')
        .orderBy('unix_time', 'desc')
        .where({
          name
        })
        .limit(1);
    }
  };
};