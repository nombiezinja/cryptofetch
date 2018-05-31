const moment = require('moment');

module.exports = (knex) => {
  return {
    insert: (dataObj) => {
      for (let baseCurrency in dataObj) {
        for (let quotedCurrency in dataObj[baseCurrency]) {
          let data = dataObj[baseCurrency][quotedCurrency];
          knex('delayed_currents')
            .insert({
              base_currency: data.FROMSYMBOL,
              quoted_currency: data.TOSYMBOL,
              last_updated_unix_time: data.LASTUPDATE,
              last_updated_utc_date_time: moment.utc(moment.unix(data.LASTUPDATE)),
              price: data.PRICE,
              high_24_hr: data.HIGH24HOUR,
              low_24_hr: data.LOW24HOUR,
              total_volume_24_hr: data.TOTALVOLUME24H
            })
            .catch(err => console.log(err.message));
        }
      }
    },

    update: (dataObj) => {
      for (let baseCurrency in dataObj) {
        for (let quotedCurrency in dataObj[baseCurrency]) {
          let data = dataObj[baseCurrency][quotedCurrency];
          knex('delayed_currents')
            .where({
              base_currency: baseCurrency,
              quoted_currency: quotedCurrency
            })
            .update({
              base_currency: data.FROMSYMBOL,
              quoted_currency: data.TOSYMBOL,
              last_updated_unix_time: data.LASTUPDATE,
              last_updated_utc_date_time: moment.utc(moment.unix(data.LASTUPDATE)),
              price: data.PRICE,
              high_24_hr: data.HIGH24HOUR,
              low_24_hr: data.LOW24HOUR,
              total_volume_24_hr: data.TOTALVOLUME24H
            })
            .catch(err => console.log(err.message));
        }
      }
    },

    getAll: (baseCurrency) => {
      baseCurrency = baseCurrency.toUpperCase();
      return knex('delayed_currents')
        .where('base_currency', baseCurrency);
    },

    // Check if db is empty
    isEmpty: async () => {
      const result = await knex('delayed_currents')
        .count('id')
        .first()
        .then(count => count)
        .catch(err => console.log(err));
      if (Number(result.count) !== 0) {
        return false;
      } else {
        return true;
      }
    }
  };
};

