var bookmark = require('./bookmark');

module.exports = function(options) {
  return new bookmark.Bookmark(options);
};
