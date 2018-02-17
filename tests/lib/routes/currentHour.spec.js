var assert = require("chai").assert;
var currentHour = require.main.require("lib/routes/currentHour");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require.main.require('server');
const should = chai.should();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const Daily = require.main.require('./lib/models/Daily')(knex);

chai.use(chaiHttp);

describe('currentHour', () => {
  // beforeEach((done) => {});

  describe('/GET /currentHour/:coin', (Daily) => {
    it('it should GET the currentHour history', (done) => {
      chai.request(server)
      .get('/currentHour/eth')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

});