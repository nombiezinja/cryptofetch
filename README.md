# Crypto Data Fetch 

A microservice congregating historical and recent cryptocurrency data for 11 coins/altcoins from Coincap and Cryptocompare, then providing api end points for retrieving these. 

Populate tasks: 
run once to populate dailies table with 3 years of historical data
run once to populate hourlies table with 24 hours of 24hour data 

Daily tasks:
Every hour on the hour: fetch data for current utc time, delete oldest entry in hourlies table  
Every day at 12utc: fetch data for current utc time, save in dailies table 


End points: 

* /dailies/:name 
    * :name (string); example: eth, btc, neo
    * get all history for currency, 1 entry/day
* /hourlies/:name
    * get 3 day history for currency, 1 entry/hour
* /current/hour/:name
    * get current hour info for currency
* /current/:name
    * get most current info for currency
