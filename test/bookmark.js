var assert = require('power-assert');

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
});
