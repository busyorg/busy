var _ = require('lodash');
var parser = require('ua-parser-js');
var jGeoIP = require('jgeoip');
var geoip = new jGeoIP('lib/targeting/GeoLite2-City.mmdb');
var acceptLanguage = require('accept-language');

var Factory = function(ip, ua, language){
  var ipRecord = geoip.getRecord(ip);
  var uaRecord = parser(ua);
  var locale = acceptLanguage.parse(language);

  this.country = _.has(ipRecord, 'country.iso_code')? ipRecord.country.iso_code : '-';
  this.language = _.has(locale, '[0].language')? locale[0].language : '-';
  this.deviceType = (_.isEmpty(uaRecord.device.type))? 'desktop' : uaRecord.device.type;
  this.os = _.has(uaRecord, 'os.name')? uaRecord.os.name : '-';
  this.browser = _.has(uaRecord, 'browser.name')? uaRecord.browser.name : '-';
};

Factory.prototype.stringify = function(){
  return JSON.stringify(this);
};

module.exports = Factory;