// Commenting out to run tests in dev environment so as to avoid dealing with databases for now
// process.env.NODE_ENV = 'test';

const assert = require("chai").assert;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../server")
const should = chai.should();
const expect = require('chai').expect

chai.use(chaiHttp);

describe('Endpoints', () => {
  // beforeEach((done) => {
  // });

  describe('GET /hour/:coin', () => {
    it('it should GET the current hour info', (done) => {
      chai.request(server)
      .get('/hour/eth')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0]).to.include.all.keys('id','volume_btc', 'display_name');
          done();
        });
    });
  });

  describe('GET /dailies/:coin', () => {
    it('it should GET dailies entries', (done) => {
      chai.request(server)
      .get('/dailies/eth')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body.every(i => expect(i).to.include.all.keys('id', 'volume_btc', 'display_name'));
          res.body.every(i => expect(i.display_name).to.equal('Ethereum'));
          done();
        });
    });
  });

  describe('GET /hourlies/:coin', () => {
    it('it should get hourlies entries', (done) => {
      chai.request(server)
      .get('/hourlies/eth')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body.every(i => expect(i).to.include.all.keys('id', 'volume_btc', 'display_name'));
          res.body.every(i => expect(i.display_name).to.equal('Ethereum'));
          done();
        });
    })
  })

});