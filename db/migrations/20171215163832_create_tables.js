
exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.createTable('dailies', function(table){
    table.increments('id').primary;
    table.string('name');
    table.string('display_name');
    table.integer('unix_time');
    table.dateTime('utc_date_time');
    table.string('price_usd');
    table.string('price_btc');
    table.string('open_usd');
    table.string('open_btc');
    table.string('close_usd');
    table.string('close_btc');
    table.string('volume_usd');
    table.string('volume_btc');
    table.string('high_usd');
    table.string('low_usd');
    table.string('high_btc');
    table.string('low_btc');
    table.timestamp('created_at');
  }),
  knex.schema.createTable('hourlies', function(table) {
    table.increments('id').primary;
    table.string('name');
    table.string('display_name');
    table.integer('unix_time');
    table.dateTime('utc_date_time');
    table.string('price_usd');
    table.string('price_btc');
    table.string('open_usd');
    table.string('open_btc');
    table.string('close_usd');
    table.string('close_btc');
    table.string('volume_btc');
    table.string('volume_usd');
    table.string('high_usd');
    table.string('low_usd');
    table.string('high_btc');
    table.string('low_btc');
    table.timestamp('created_at');
  })
  ]);
};
  
exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.dropTable('dailies'),
  knex.schema.dropTable('hourlies')
  ]);
};
  