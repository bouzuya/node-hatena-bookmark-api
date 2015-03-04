var Promise = require('es6-promise').Promise;
var request = require('request');
var wsse = require('wsse');
var parser = require('./parser');

var Bookmark = function(options) {
  options = options || {};
  this._type = options.type || 'wsse';
  if (this._type === 'wsse') {
    this._username = options.username;
    this._apikey = options.apikey;
  } else if (this._type === 'oauth') {
    this._consumerKey = options.consumerKey;
    this._consumerSecret = options.consumerSecret;
    this._token = options.token;
    this._tokenSecret = options.tokenSecret;
  } else {
    throw new Error('invalid type');
  }
};

Bookmark.prototype.index = function(options, callback) {
  var promise = new Promise(function(resolve, reject) {
    var qs = ['of', 'date', 'tag'].reduce(function(qs, key) {
      var value = options[key];
      if (typeof value !== 'undefined') {
        qs[key] = value;
      }
      return qs;
    }, {});
    var params = {
      url: 'http://b.hatena.ne.jp/atom/feed',
      qs: qs
    };
    if (this._type === 'wsse') {
      params.headers = this._getWSSEHeaders();
    } else {
      params.oauth = {
        consumer_key: this._consumerKey,
        consumer_secret: this._consumerSecret,
        token: this._token,
        token_secret: this._tokenSecret
      };
    }
    return request(params, function(err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  }.bind(this))
  .then(function(res) {
    var p = new parser.XmlParser();
    return p.parse(res.body);
  });
  if (!callback) return promise;
  return promise
  .then(function(bookmarks) { return callback(null, bookmarks); })
  .catch(function(err) { return callback(err, null); });
};

Bookmark.prototype._getWSSEHeaders = function() {
  if (this._type !== 'wsse') return null;
  var token = wsse().getUsernameToken(
    this._username, this._apikey, { nonceBase64: true });
  return {
    'Authorization': 'WSSE profile="UsernameToken"',
    'X-WSSE': 'UsernameToken ' + token
  };
};

module.exports.Bookmark = Bookmark;
