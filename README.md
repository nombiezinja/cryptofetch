# Crypto Data Fetch 

# Setup

* .env and enter the DB_* environment configuration
  * include NODE_ENV=development
* run migrations `./node_modules/.bin/knex migrate:latest`
* Start up the service with `npm start`
* Seed by going to `http://localhost:8080/test1`

A microservice congregating historical and recent cryptocurrency data for 11 coins/altcoins from Coincap and Cryptocompare, then providing api end points for retrieving these. 

Populate tasks: 
run once to populate dailies table with 3 years of historical data
run once to populate hourlies table with 24 hours of 24hour data 

Daily tasks:
Every hour on the hour: fetch data for current utc time, delete oldest entry in hourlies table  
Every day at 12utc: fetch data for current utc time, save in dailies table 
