var Promise = require('es6-promise').Promise;
var request = require('request');
var wsse = require('wsse');
var xml2js = require('xml2js');

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
    var params = ['of', 'date', 'tag'];
    var qs = params.reduce(function(qs, key) {
      var value = options[key];
      if (typeof value !== 'undefined') {
        qs[key] = value;
      }
      return qs;
    }, {});
    return request({
      url: 'http://b.hatena.ne.jp/atom/feed',
      headers: this._getAuthorizationHeaders(),
      qs: qs
    }, function(err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  }.bind(this))
  .then(function(res) { return this._parseXml(res.body); }.bind(this));
  if (!callback) return promise;
  return promise
  .then(function(bookmarks) { return callback(null, bookmarks); })
  .catch(function(err) { return callback(err, null); });
};

Bookmark.prototype._getAuthorizationHeaders = function() {
  var token = wsse().getUsernameToken(
    this._username, this._apikey, { nonceBase64: true });
  return {
    'Authorization': 'WSSE profile="UsernameToken"',
    'X-WSSE': 'UsernameToken ' + token
  };
};

Bookmark.prototype._parseXml = function(xml) {
  return new Promise(function(resolve, reject) {
    var parser = new xml2js.Parser({
      explicitArray: false,
      explicitCharkey: true
    });
    parser.parseString(xml, function(err, xml) {
      if (err) return reject(err);
      return resolve(xml);
    });
  });
};

module.exports.Bookmark = Bookmark;
