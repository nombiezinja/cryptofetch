
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.createTable('histories', function(table){
    table.increments('id').primary;
    table.string('coin_id');
    table.string('display_name');
    table.integer('unix_time');
    table.dateTime('utc_date_time');
    table.string('market_cap');
    table.string('price_usd');
    table.string('price_btc');
    table.string('open_usd');
    table.string('open_btc');
    table.string('close_usd');
    table.string('close_btc');
    table.string('volume_usd');
    table.string('volume_btc');
    table.timestamp('created_at');
  }),
  knex.schema.createTable('dailies', function(table) {
    table.increments('id').primary;
    table.string('coin_id');
    table.string('display_name');
    table.integer('unix_time');
    table.dateTime('utc_date_time');
    table.string('market_cap');
    table.string('price_usd');
    table.string('price_btc');
    table.string('open_usd');
    table.string('open_btc');
    table.string('close_usd');
    table.string('close_btc');
    table.string('volume_btc');
    table.string('volume_usd');
    table.timestamp('created_at');
  })
  ]);
  
};
  
exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.dropTable('histories'),
  knex.schema.dropTable('dailies')
  ]);
};
  