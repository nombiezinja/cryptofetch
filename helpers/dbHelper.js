module.exports = (knex) => {
  return {
    saveHistory: (coinId, coinName, time, response) => {
      console.log(response);
      return knex.table('histories').insert({
          coin_id: coinId,
          display_name: coinName,
          unix_time: time, 
          price_usd: response[coinId.toUpperCase()].USD, 
          price_btc: response[coinId.toUpperCase()].BTC, 
        }).returning('id');    
    }
  }
}    
