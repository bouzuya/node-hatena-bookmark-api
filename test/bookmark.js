require('./helper');

var bookmark = require('../lib/bookmark');

describe('Bookmark', function() {
  it('should be defined', function() {
    assert(bookmark);
    assert(bookmark.Bookmark);
  });

  describe('constructor', function() {
    it('should set wsse options to private vars', function() {
      var options = { type: 'wsse', username: 'u', apikey: 'a' };
      var obj = new bookmark.Bookmark(options);
      assert(obj._username === 'u');
      assert(obj._apikey === 'a');
    });
  });

  describe.skip('#index', function() {});

  describe('#_getAuthorizationHeaders', function() {
    it('should return request headers for WSSE', function() {
      var options = { type: 'wsse', username: 'u', apikey: 'a' };
      var obj = new bookmark.Bookmark(options);
      var headers = obj._getAuthorizationHeaders();
      assert(headers.Authorization === 'WSSE profile="UsernameToken"');
      assert(headers['X-WSSE'].match(/UsernameToken/));
      assert(headers['X-WSSE'].match(/Username="u"/));
      assert(headers['X-WSSE'].match(/PasswordDigest=".*"/));
      assert(headers['X-WSSE'].match(/Nonce=".*"/));
      assert(headers['X-WSSE'].match(/Created=".*"/));
    });
  });

  describe('#_parseXml', function() {
    beforeEach(function() { this.bookmark = new bookmark.Bookmark(); });

    it('should return Promise', function() {
      var xml = require('fs').readFileSync('./test/fixtures/feed-simple.xml');
      var result = this.bookmark._parseXml(xml);
      assert(result.then);
    });

    it('should parse XML', function() {
      var fs = require('fs');
      var xml = fs.readFileSync('./test/fixtures/feed-simple.xml');
      var json = fs.readFileSync('./test/expectations/feed-simple.json');
      return this.bookmark._parseXml(xml)
      .then(function(xml) {
        assert.deepEqual(xml, JSON.parse(json));
      });
    });
  });
});
