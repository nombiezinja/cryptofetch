const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const constructUrl = (coinId, coinName, time) => {
  const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coinId.toUpperCase()}&tsyms=BTC,USD&ts=${time}`
  
  return {coinId: coinId, coinName: coinName, time: time, url: url}
}

module.exports = {
  flatten: flatten,
  constructUrl: constructUrl
}