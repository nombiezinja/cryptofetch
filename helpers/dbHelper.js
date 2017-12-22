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

    updateHistoryWithOpen: (unixTime, openResponse, coinId) => {
      console.log('openresponse', openResponse,'coinid', coinId, unixTime, 'unixtime')
      return knex.table('histories')
        .update({
          open_usd: openResponse[coinId.toUpperCase()].USD,
          open_btc: openResponse[coinId.toUpperCase()].BTC
        }).where({
          unix_time: unixTime, 
          coin_id: coinId
        }).returning('id');
    },

    updateHistoryWithClose: (unixTime, closeResponse, coinId) => {
      console.log('closeresponse', closeResponse,'coinid', coinId, unixTime, 'unixtime')
      return knex.table('histories')
        .update({
          close_usd: closeResponse[coinId.toUpperCase()].USD,
          close_btc: closeResponse[coinId.toUpperCase()].BTC
        }).where({
          unix_time: unixTime, 
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

    saveDaily: (coinId, coinName, time, priceResponse) => {
      console.log('priceResponse',priceResponse);
      console.log(moment.utc(moment.unix(time)))
      return knex.table('dailies').insert({
        coin_id: coinId,
        display_name: coinName,
        unix_time: time,
        utc_date_time: moment.utc(moment.unix(time)),
        price_usd: priceResponse[coinId.toUpperCase()].USD,
        price_btc: priceResponse[coinId.toUpperCase()].BTC,
        created_at: moment.utc()
      }).returning('id');
    }



  }

}