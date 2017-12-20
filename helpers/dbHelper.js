const moment = require('moment')

module.exports = (knex) => {
  return {
    saveHistory: (coinId, coinName, time, priceResponse, openResponse, closeResponse) => {
      console.log(priceResponse);
      console.log('openResponse', openResponse)
      console.log('closeResponse', closeResponse)
      console.log(moment.utc(moment.unix(time)))
      return knex.table('histories').insert({
          coin_id: coinId,
          display_name: coinName,
          unix_time: time, 
          utc_date_time:moment.utc(moment.unix(time)),
          price_usd: priceResponse[coinId.toUpperCase()].USD, 
          price_btc: priceResponse[coinId.toUpperCase()].BTC,
          open_usd: openResponse[coinId.toUpperCase()].USD, 
          open_btc: openResponse[coinId.toUpperCase()].BTC,
          close_usd: closeResponse[coinId.toUpperCase()].USD, 
          close_btc: closeResponse[coinId.toUpperCase()].BTC,
          created_at: moment.utc() 
        }).returning('id');    
    }
  }
}    
