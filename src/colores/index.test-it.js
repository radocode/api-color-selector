'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../../server');

chai.use(chaiHttp);

describe('Colores - IT', () => {

  describe('GET /colores', () => {

    it('lists all colores', (done) => {
      chai.request(server)
        .get('/colores')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.be.above(3);
          done();
        });
    });

  });

  describe('GET /colores/id', () => {

    it('lists color', (done) => {
      chai.request(server)
        .get('/colores/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.be.equal(1);
          done();
        });
    });

  });

  describe('GET /colores/id?xml=1', () => {

    it('lists color in xml', (done) => {
      chai.request(server)
        .get('/colores/1?xml=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

  });

  describe('GET /colores?page=1', () => {

    it('lists colores with page 1', (done) => {
      chai.request(server)
        .get('/colores?page=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.be.equal(6);
          done();
        });
    });

  });

  describe('GET /colores?page=1', () => {

    it('lists colores with page 1 and xml', (done) => {
      chai.request(server)
        .get('/colores?page=1&xml=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

  });

  describe('PUT /colores', () => {

    it('returns an error', (done) => {
      chai.request(server)
        .put('/colores')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('not found');
          done();
        });
    });

  });

});
