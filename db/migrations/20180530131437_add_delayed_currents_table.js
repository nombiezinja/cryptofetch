
exports.up = function(knex) {
  return knex.schema.createTable('delayed_currents', function(table){
    table.increments('id').primary;
    table.string('base_currency');
    table.string('quoted_currency');
    table.integer('last_updated_unix_time');
    table.dateTime('last_updated_utc_date_time');
    table.string('price');
    table.string('high_24_hr');
    table.string('low_24_hr');
    table.string('total_volume_24_hr');
    table.index(['base_currency','last_updated_unix_time']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('delayed_currents');
};
