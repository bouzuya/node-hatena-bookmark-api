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

    it('should set oauth options to private vars', function() {
      var options = {
        type: 'oauth',
        consumerKey: 'consumerKey',
        consumerSecret: 'consumerSecret',
        token: 'token',
        tokenSecret: 'tokenSecret'
      };
      var obj = new bookmark.Bookmark(options);
      assert(obj._consumerKey === 'consumerKey');
      assert(obj._consumerSecret === 'consumerSecret');
      assert(obj._token === 'token');
      assert(obj._tokenSecret === 'tokenSecret');
    });
  });

  describe('#index', function() {
    beforeEach(function() {
      var fs = require('fs');
      var request = require('request');

      this.requests = [];
      this.xml = fs.readFileSync('./test/fixtures/feed-simple.xml');
      this.json = fs.readFileSync('./test/expectations/feed-simple.json');
      this.stub = this.sinon.stub(request, 'Request', function(options) {
        var req = {};
        req.url = options.url;
        req.headers = options.headers;
        req.qs = options.qs;
        this.requests.push(req);
        options.callback(null, { body: this.xml });
      }.bind(this));
      this.bookmark = new bookmark.Bookmark({
        type: 'wsse',
        username: 'username',
        apikey: 'apikey'
      });
    });

    context('callback style', function() {
      beforeEach(function(done) {
        this.bookmarks = null;
        this.bookmark.index({}, function(err, bookmarks) {
          this.error = err;
          this.bookmarks = bookmarks;
          done();
        }.bind(this));
      });

      it('works', function() {
        assert(this.error === null);
        assert(this.requests.length === 1);
        var req = this.requests[0];
        assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
        assert(req.headers.Authorization === 'WSSE profile="UsernameToken"');
        assert.deepEqual(this.bookmarks, JSON.parse(this.json));
      });
    });

    context('Promise style', function() {
      context('without params', function() {
        it('works', function() {
          return this.bookmark.index({})
          .then(function(bookmarks) {
            assert(this.requests.length === 1);
            var req = this.requests[0];
            assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
            assert(req.headers.Authorization === 'WSSE profile="UsernameToken"');
            assert.deepEqual(bookmarks, JSON.parse(this.json));
          }.bind(this));
        });
      });

      context('with of=20', function() {
        it('works', function() {
          return this.bookmark.index({ of: 20 })
          .then(function(bookmarks) {
            assert(this.requests.length === 1);
            var req = this.requests[0];
            assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
            assert(req.headers.Authorization === 'WSSE profile="UsernameToken"');
            assert.deepEqual(req.qs, { of: 20 });
            assert.deepEqual(bookmarks, JSON.parse(this.json));
          }.bind(this));
        });
      });

      context('with date=20150101', function() {
        it('works', function() {
          return this.bookmark.index({ date: '20150101' })
          .then(function(bookmarks) {
            assert(this.requests.length === 1);
            var req = this.requests[0];
            assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
            assert(req.headers.Authorization === 'WSSE profile="UsernameToken"');
            assert.deepEqual(req.qs, { date: '20150101' });
            assert.deepEqual(bookmarks, JSON.parse(this.json));
          }.bind(this));
        });
      });

      context('with tag=atode', function() {
        it('works', function() {
          return this.bookmark.index({ tag: 'atode' })
          .then(function(bookmarks) {
            assert(this.requests.length === 1);
            var req = this.requests[0];
            assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
            assert(req.headers.Authorization === 'WSSE profile="UsernameToken"');
            assert.deepEqual(req.qs, { tag: 'atode' });
            assert.deepEqual(bookmarks, JSON.parse(this.json));
          }.bind(this));
        });
      });
    });
  });

  describe('#_getWSSEHeaders', function() {
    it('should return request headers for WSSE', function() {
      var options = { type: 'wsse', username: 'u', apikey: 'a' };
      var obj = new bookmark.Bookmark(options);
      var headers = obj._getWSSEHeaders();
      assert(headers.Authorization === 'WSSE profile="UsernameToken"');
      assert(headers['X-WSSE'].match(/UsernameToken/));
      assert(headers['X-WSSE'].match(/Username="u"/));
      assert(headers['X-WSSE'].match(/PasswordDigest=".*"/));
      assert(headers['X-WSSE'].match(/Nonce=".*"/));
      assert(headers['X-WSSE'].match(/Created=".*"/));
    });

    it('should return null for OAuth', function() {
      var options = {
        type: 'oauth',
        consumerKey: 'consumerKey',
        consumerSecret: 'consumerSecret',
        token: 'token',
        tokenSecret: 'tokenSecret'
      };
      var obj = new bookmark.Bookmark(options);
      var headers = obj._getWSSEHeaders();
      assert(headers === null);
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
