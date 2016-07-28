var Targeting = function(){};

Targeting.prototype.get = function(){
  return {
    deviceType: require('./deviceType.json'),
    os: require('./os.json'),
    browser: require('./browser.json'),
    country: require('./country.json'),
    language: require('./language.json')
  };
};

module.exports = Targeting;