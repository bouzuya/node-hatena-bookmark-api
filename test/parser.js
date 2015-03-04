require('./helper');

var parser = require('../lib/parser');

describe('Parser', function() {
  describe('#parse', function() {
    beforeEach(function() { this.obj = new parser.XmlParser(); });

    it('should return Promise', function() {
      var xml = require('fs').readFileSync('./test/fixtures/feed-simple.xml');
      var result = this.obj.parse(xml);
      assert(result.then);
    });

    it('should pass the parsed XML', function() {
      var fs = require('fs');
      var xml = fs.readFileSync('./test/fixtures/feed-simple.xml');
      var json = fs.readFileSync('./test/expectations/feed-simple.json');
      return this.obj.parse(xml)
      .then(function(parsed) {
        assert.deepEqual(parsed, JSON.parse(json));
      });
    });
  });
});
