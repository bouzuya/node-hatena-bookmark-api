var assert = require('power-assert');
var sinon = require('sinon');

var index = require('../lib/');
var bookmark = require('../lib/bookmark');

describe('index.js', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('should be defined', function() {
    assert(index);
  });

  it('should pass arguments to Bookmark constructor', function() {
    var stub = sinon.stub(bookmark, 'Bookmark');
    var args = { foo: 123 };
    var instance = index(args);
    assert(stub.callCount === 1);
    assert(stub.firstCall.args[0] == args);
  });
});
