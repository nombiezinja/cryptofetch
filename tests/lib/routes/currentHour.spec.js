// global.rootRequire = (name) => {
//   return require(__dirname + '/' + name);
// }

process.env.NODE_ENV = 'test';

const assert = require("chai").assert;

const chai = require('chai');
const chaiHttp = require('chai-http');
// const server = require.main.require('server');
// const server = rootRequire("./server")
const server = require("../../../server")
const should = chai.should();


chai.use(chaiHttp);

describe('Endpoints', () => {
  // beforeEach((done) => {});

  describe('GET /currentHour/:coin', () => {
    it('it should GET the currentHour history', (done) => {
      chai.request(server)
      .get('/currentHour/eth')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

});