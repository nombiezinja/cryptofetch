const moment = require('moment-timezone')

const newYorkIsDst = (unixTime) => {
  return moment.tz(moment(moment.unix(unixTime)).utc(), 'america_new_york').isDST()
}

const getUtcClosingTime = (unixTime) => {
  if (newYorkIsDst(unixTime)){
    return 21
  } else {
    return 22
  }
}

const getUtcOpeningTime = (unixTime) => {
  if (newYorkIsDst(unixTime)){
    return 9
  } else {
    return 10
  }
}

module.exports = {
  getUtcClosingTime: getUtcClosingTime,
  getUtcOpeningTime: getUtcOpeningTime 
}    
