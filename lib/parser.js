var Promise = require('es6-promise').Promise;
var xml2js = require('xml2js');

var XmlParser = function() {};

XmlParser.prototype.parse = function(xml) {
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

module.exports.XmlParser = XmlParser;
