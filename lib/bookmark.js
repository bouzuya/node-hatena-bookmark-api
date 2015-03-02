var Bookmark = function(options) {
  options = options || {};
  var type = options.type || 'wsse';
  if (type === 'wsse') {
    this._username = options.username;
    this._apikey = options.apikey;
  }
};

module.exports.Bookmark = Bookmark;
