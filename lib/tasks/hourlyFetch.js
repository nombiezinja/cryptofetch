const ENV = process.env.NODE_ENV 
const knexConfig = require.main.require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const Daily = require.main.require('./lib/models/Daily')(knex);

const currencies = [{
    coinId: 'btc',
    coinName: 'Bitcoin'
  },
  {
    coinId: 'eth',
    coinName: 'Ethereum'
  },
  {
    coinId: 'neo',
    coinName: 'NEO'
  },
  {
    coinId: 'gas',
    coinName: 'GAS'
  },
  {
    coinId: 'ltc',
    coinName: 'Litecoin'
  },
  {
    coinId: 'lsk',
    coinName: 'Lisk'
  },
  {
    coinId: 'xmr',
    coinName: 'Monero XMR'
  },
  {
    coinId: 'ark',
    coinName: 'Ark'
  },
  {
    coinId: 'iot',
    coinName: 'Iota'
  },
  {
    coinId: 'omg',
    coinName: 'OmiseGO'
  },
  {
    coinId: 'bch',
    coinName: 'Bitcoin Cash'
  }
]


const fetchHourlyData = () => {
  currencies.forEach((currency, j) => {
    setTimeout(() => {
      fetchAndSave(currency.coinId, currency.coinName)
    }, 2000 * (j + 1));
  });
}

const getData = async(coinId, coinName, currency) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${coinId.toUpperCase()}&tsym=${currency}&limit=1&aggregate=1&e=CCCAGG`);
    const json = await response.json();
    return {
      coinId: coinId,
      coinName: coinName,
      data: json.Data
    };
  } catch (error) {
    console.log(error);
  }
};

const fetchAndSave = async(coinId, coinName) => {

  const btcJson = await getData(coinId, coinName, 'BTC');
  const usdJson = await getData(coinId, coinName, 'USD');

  if (usdJson.data) {
    console.log("usdJson", usdJson.data)
    usdJson.data.forEach((entry) => {
      Daily.checkDuplicate(coinId, entry.time).then((result) => {
        console.log("checking duplicates", result)
        console.log("result[0]", result[0])
        if (!result[0]) {
          console.log(result)
          Daily.saveDaily(usdJson.coinId, usdJson.coinName, entry).then((id) => {
            console.log(`Entry ${id} saved for ${coinId} at time ${moment.unix(entry.time)}`);

            const deleteOldest = Daily.oldestDaily(coinId).then((result) => {
              console.log("Oldest entry:", result)
              Daily.deleteOldest(result[0].id).then(() => {
                console.log(`Oldest entry deleted for ${coinId}`)
              }).catch((err) => {
                console.log(err)
              })
            }).catch((err) => {
              console.log(err)
            })
            
            if (btcJson.data) {
              console.log("btcJson", btcJson.data)
              btcJson.data.forEach((entry) => {
                Daily.updateDailyBtc(btcJson.coinId, entry).then((id) => {
                  console.log(`Entry ${id} saved for ${coinId} at time ${moment.unix(entry.time)} with BTC info`);
                }).catch((err) => {
                  console.log(err)
                })
              })
            };
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log(`Skipping duplicate entry save for ${coinId}`)
        }
      }).catch((err) => {
        console.log(err)
      })
    })
  };
    
};

module.exports = {
  fetchHourlyData: fetchHourlyData
};