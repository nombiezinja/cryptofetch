# Crypto Data Fetch 

Note: This service is currently running on the staging server and does not need to be set up locally if you're just accessing the data. To access the data, use the end points below.
http://staging-temp.fxmusings.com:3000/

# Setup

* make .env file and enter the DB_* environment configuration:
    ```DB_NAME=crypto_data_fetch
        DB_TEST_NAME=crypto_data_test
        DB_SSL=true
        DB_PASSWORD=[your_password]
        DB_PORT=5432
        DB_USER=[your_username]
        PORT=8080```
  * include NODE_ENV=development
* run migrations `./node_modules/.bin/knex migrate:latest`
* Start up the service with `npm start`
* Seed by running `node populate.js` from the root directory

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
* /dailies/:name?begin_time=:begin_time&end_time=:end_time&order=:order
    * begin_time, end_time: integer, unix time format; example:1519282000
    * order: tell knex to sort records by unix_time; values can be 'asc' or 'desc'
    * get all entries for period of time begin_time ~ end_time
* /dailies/:name?timestamp = :timestamp 
    * timestamp: integer, unix time format
    * get single entry for day (will pick day closest to timestamp)

* /hourlies/:name
    * get 3 day history for currency, 1 entry/hour
* /hourlies/:name?begin_time=:begin_time&end_time=:end_time&order=:order
    * begin_time, end_time: integer, unix time format; example:1519282000
    * order: tell knex to sort records by unix_time; values can be 'asc' or 'desc'
    * get all entries for period of time begin_time ~ end_time 
* /hourlies/:name?timestamp = :timestamp 
    * timestamp: integer, unix time format
    * get single entry for hour (will pick hour closest to timestamp)
    * note: requesting an rate from this endpoint beyond what is stored in the table will return an empty array. Use dailies routes for older dates.
* /current/:name
    * get most current info for currency
* /current/from/:name/to/:currency
    * :name (string); base currency, e.g. eth, btc, neo
    * :currency (string); quoted currency, only accepts usd, btc
    * get most current price data for a currency pair from local database
