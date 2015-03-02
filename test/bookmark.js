var assert = require('power-assert');

var bookmark = require('../lib/bookmark');

describe('Bookmark', function() {
  it('should be defined', function() {
    assert(bookmark);
    assert(bookmark.Bookmark);
  });
});
