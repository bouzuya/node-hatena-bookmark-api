var Promise = require('es6-promise').Promise;
var wsse = require('wsse');
var xml2js = require('xml2js');

var Bookmark = function(options) {
  options = options || {};
  var type = options.type || 'wsse';
  if (type === 'wsse') {
    this._username = options.username;
    this._apikey = options.apikey;
  }
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
