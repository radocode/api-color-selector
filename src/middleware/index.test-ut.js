'use strict';

const chai = require('chai');
const expect = chai.expect;
const middleware = require('./index');

describe('Middleware - UT', () => {

  describe('checkXml()', () => {

    it('passes everything along', (done) => {
      // Stub req
      const reqStub = null;

      // Stub res
      const resStub = null;

      // Mock next
      const nextMock = (err) => {
        expect(err).to.be.undefined;
        done();
      };

      // Run unit under test
      middleware.checkXml(reqStub, resStub, nextMock);
    });

  });

});
