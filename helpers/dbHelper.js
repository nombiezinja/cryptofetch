module.exports = (knex) => {
  return {
    saveHistory: (response ) => {
      console.log(response)
      console.log(JSON.parse(response))
      return knex.table('histories').insert({
          coin_id: 'eth',
          display_name: 'ethereum',
          unix_time: 1513584000, 
          price_usd: '1.1', 
          price_btc: '2.2', 
        }).returning('id');    
    }
  }
}    

