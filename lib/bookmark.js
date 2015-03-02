var wsse = require('wsse');

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

module.exports.Bookmark = Bookmark;
