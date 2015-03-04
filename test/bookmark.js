require('./helper');

var bookmark = require('../lib/bookmark');

describe('Bookmark', function() {
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
        req.oauth = options.oauth;
        req.qs = options.qs;
        this.requests.push(req);
        options.callback(null, { body: this.xml });
      }.bind(this));
    });

    context('type: wsse', function() {
      beforeEach(function() {
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
    });

    context('type: oauth', function() {
      beforeEach(function() {
        this.oauth = {
          type: 'oauth',
          consumerKey: 'consumerKey',
          consumerSecret: 'consumerSecret',
          token: 'token',
          tokenSecret: 'tokenSecret'
        };
        this.bookmark = new bookmark.Bookmark(this.oauth);
      });

      context('Promise style', function() {
        context('without params', function() {
          it('works', function() {
            return this.bookmark.index({})
            .then(function(bookmarks) {
              assert(this.requests.length === 1);
              var req = this.requests[0];
              assert(req.url === 'http://b.hatena.ne.jp/atom/feed');
              assert(req.oauth.consumer_key === this.oauth.consumerKey);
              assert(req.oauth.consumer_secret === this.oauth.consumerSecret);
              assert(req.oauth.token === this.oauth.token);
              assert(req.oauth.token_secret === this.oauth.tokenSecret);
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
              assert(req.oauth.consumer_key === this.oauth.consumerKey);
              assert(req.oauth.consumer_secret === this.oauth.consumerSecret);
              assert(req.oauth.token === this.oauth.token);
              assert(req.oauth.token_secret === this.oauth.tokenSecret);
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
              assert(req.oauth.consumer_key === this.oauth.consumerKey);
              assert(req.oauth.consumer_secret === this.oauth.consumerSecret);
              assert(req.oauth.token === this.oauth.token);
              assert(req.oauth.token_secret === this.oauth.tokenSecret);
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
              assert(req.oauth.consumer_key === this.oauth.consumerKey);
              assert(req.oauth.consumer_secret === this.oauth.consumerSecret);
              assert(req.oauth.token === this.oauth.token);
              assert(req.oauth.token_secret === this.oauth.tokenSecret);
              assert.deepEqual(req.qs, { tag: 'atode' });
              assert.deepEqual(bookmarks, JSON.parse(this.json));
            }.bind(this));
          });
        });
      });
    });
  });
});
