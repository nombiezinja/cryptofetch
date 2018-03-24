const currencies = require('../data/currencies');
const validParams = require('../data/validParams');

const checkParams = (params) => {
  const validParams = currencies.filter(currency => (currency.name === params.name));
  return validParams.length > 0;
};

const order = ['asc', 'desc']

const checkQuery = async (query) => {
  // should only have timestamp OR begin + end time, not both or neither
  const hasBeginAndEndTime = await checkBeginEndTime(query);

  if (hasBeginAndEndTime && query.timestamp) {
    return false;
  }

  for (let value in query) {

    //time stamp query params should be time stamps
    // order query params can only be asc or desc
    if(value == 'order') {
      if (order.indexOf(query[value]) < 0) {
        return false
      }
    } else {
      const isTimestamp = await isPositiveInteger(query[value]);
      if (!isTimestamp) {
        return false;
      }
    }

  }

  return true;
};

const checkBeginEndTime = (query) => {
  if (query.begin_time && query.end_time) {
    return true;
  } else {
    return false;
  }
};

const isPositiveInteger = (n) => {
  return parseInt(n, 10) >>> 0 === parseFloat(n);
};

module.exports = {
  checkParams: checkParams,
  checkQuery: checkQuery,
};