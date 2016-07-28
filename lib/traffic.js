var nohm = require('nohm').Nohm;

var Traffic = function(){};

Traffic.prototype.addImpression = function(){
  return this;
};

Traffic.prototype.addClick = function(){
  return this;
};

Traffic.prototype.addLead = function(){
  return this;
};

Traffic.prototype.get = function(){
  return {
    impressions: 0,
    clicks: 0,
    leads: 0,
    profit: 0,
    cpm: 0,
    cpc: 0,
    cpl: 0,
    ctr: 0,
    cr: 0
  };
};

module.exports = Traffic;