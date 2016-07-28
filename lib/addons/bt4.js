var con = require('./../../db'),
  _ = require('lodash'),
  request = require('request');

var Bt4 = function(){};

Bt4.prototype.report = function(userId, options, callback){
  if (options.groupBy == 'traffic-source') {
    con.query("SELECT * FROM traffic_source WHERE user_id = ?", userId, function(error, results, fields) {
      results = JSON.parse(JSON.stringify(results));
      callback({
        entries: this._parseEntries(results),
        total: this._parseEntry(results[0])
      });
    }.bind(this));
  } else {
    callback('');
  }
};

Bt4.prototype._parseEntries = function(entries){
  if (!entries) {
    return [];
  }
  return Object.keys(entries).map(function(key) {
    return this._parseEntry(entries[key]);
  }.bind(this));
};

Bt4.prototype._parseEntry = function(entry){
  entry.id = 'bt4:' + entry.id;
  var traffic = {
    imp: 0,
    clicks: 0,
    leads: 0,
    roi: 0,
    cost: 0,
    revenue: 0,
    profit: 0
  };
  return _.merge(entry, traffic);
};

Bt4.prototype.campaign = function(userId, options, callback){

};

Bt4.prototype.trafficSource = function(userId, options, callback){
  con.query("SELECT * FROM traffic_source WHERE user_id = ? AND id = ?", [userId, options.id], function(error, results, fields) {
    results = JSON.parse(JSON.stringify(results));
    callback(results[0]);
  });
};

Bt4.prototype.flow = function(userId, options, callback){

};

Bt4.prototype.lander = function(userId, options, callback){

};

Bt4.prototype.offer = function(userId, options, callback){

};

Bt4.prototype.affiliateNetwork = function(userId, options, callback){

};

module.exports = new Bt4();