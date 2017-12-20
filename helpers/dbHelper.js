const moment = require('moment')

module.exports = (knex) => {
  return {
    saveHistory: (coinId, coinName, time, priceResponse) => {
      console.log(priceResponse);
      console.log(moment.utc(moment.unix(time)))
      return knex.table('histories').insert({
          coin_id: coinId,
          display_name: coinName,
          unix_time: time, 
          utc_date_time:moment.utc(moment.unix(time)),
          price_usd: priceResponse[coinId.toUpperCase()].USD, 
          price_btc: priceResponse[coinId.toUpperCase()].BTC,
          created_at: moment.utc() 
        }).returning('id');    
    },

    updateHistoryWithOpen: (coinId, time, openResponse) => {
      console.log(openResponse)
      return knex.table('histories')
        .update({
          open_usd: openResponse[coinId.toUpperCase()].USD,
          open_btc: priceREsponse[coinId.toUpperCase()].BTC
        })
    }
  }

}    
