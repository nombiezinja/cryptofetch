// Commenting out to run tests in dev environment so as to avoid dealing with databases for now
// process.env.NODE_ENV = 'test';

const assert = require("chai").assert;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../../../server")
const should = chai.should();
const expect = require('chai').expect

chai.use(chaiHttp);

describe('Endpoints', () => {
  // beforeEach((done) => {
  // });

  describe('GET /currentHour/:coin', () => {
    it('it should GET the currentHour history', (done) => {
      chai.request(server)
      .get('/currentHour/eth')
        .end((err, res) => {
          console.log(res.body[0])
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0]).to.have.all.keys('id','volume_btc');
          done();
        });
    });
  });

});