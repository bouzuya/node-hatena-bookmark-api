var assert = require('power-assert');
var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
  global.assert = assert;
});

afterEach(function() {
  this.sinon.restore();
  delete global.assert;
});
