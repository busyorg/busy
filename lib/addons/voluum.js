var request = require('request');

var Voluum = function(){};

Voluum.prototype.getToken = function(params, callback){
  var auth = "Basic " + new Buffer(params.username + ":" + params.password).toString("base64");
  request({url: 'https://security.voluum.com/login', headers: {'Authorization': auth}}, function (error, response, body) {
      callback(JSON.parse(body));
    }
  );
};

Voluum.prototype.report = function(token, options, callback){
  options.tz = 'Etc/GMT';
  options.sort = 'visits';
  options.direction = 'asc';
  options.include = 'active';
  if (options.campaignId) {
    options.filter1 = 'campaign';
    options.filter1Value = options.campaignId;
    delete options.campaignId;
  }
  if (options.trafficSourceId) {
    options.filter1 = 'traffic-source';
    options.filter1Value = options.trafficSourceId;
    delete options.trafficSourceId;
  }
  if (options.flowId) {
    options.filter1 = 'flow';
    options.filter1Value = options.flowId;
    delete options.flowId;
  }
  if (options.landerId) {
    options.filter1 = 'lander';
    options.filter1Value = options.landerId;
    delete options.landerId;
  }
  if (options.offerId) {
    options.filter1 = 'offer';
    options.filter1Value = options.offerId;
    delete options.offerId;
  }
  if (options.affiliateNetworkId) {
    options.filter1 = 'affiliate-network';
    options.filter1Value = options.affiliateNetworkId;
    delete options.affiliateNetworkId;
  }
  options = '?' +
    Object.keys(options).map(function(key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(options[key]);
    }).join('&');
  request({url: 'https://reports.voluum.com/report' + options, headers: {'cwauth-token': token}}, function (error, response, body) {
    console.log(body);
      callback(this._parse(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype._parse = function(data){
  if (!data.rows) {
    return [];
  }
  return {
    entries: this._parseEntries(data.rows),
    total: this._parseEntry(data.totals)
  }
};

Voluum.prototype._parseEntries = function(entries){
  if (!entries) {
    return [];
  }
  return Object.keys(entries).map(function(key) {
    return this._parseEntry(entries[key]);
  }.bind(this));
};

Voluum.prototype._parseEntry = function(entry){
    var id = entry.campaignId || entry.trafficSourceId || entry.flowId || entry.landerId || entry.offerId || entry.affiliateNetworkId;
    var name = entry.campaignName || entry.campaignNamePostfix || entry.trafficSourceName || entry.flowName || entry.landerName || entry.offerName || entry.affiliateNetworkName
      || entry.countryName || entry.device || entry.os || entry.browser || entry.isp;
    return {
      id: 'voluum:' + id,
      name: name,
      created: entry.created,
      updated: entry.updated,
      imp: entry.visits,
      clicks: entry.clicks,
      leads: entry.conversions,
      roi: entry.roi,
      cost: entry.cost,
      revenue: entry.revenue,
      profit: entry.profit
    }
};

Voluum.prototype.campaign = function(token, options, callback){
  request({url: 'https://core.voluum.com/campaigns/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
    callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype.trafficSource = function(token, options, callback){
  request({url: 'https://core.voluum.com/traffic-sources/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
      callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype.flow = function(token, options, callback){
  request({url: 'https://core.voluum.com/flows/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
      callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype.lander = function(token, options, callback){
  request({url: 'https://core.voluum.com/landers/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
    callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype.offer = function(token, options, callback){
  request({url: 'https://core.voluum.com/offers/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
    callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype.affiliateNetwork = function(token, options, callback){
  request({url: 'https://core.voluum.com/affiliate-networks/' + options.id, headers: {'cwauth-token': token}}, function (error, response, body) {
      callback(this._parseSingle(JSON.parse(body)));
    }.bind(this)
  );
};

Voluum.prototype._parseSingle = function(entry){
  var name = entry.namePostfix || entry.name;
  var url = entry.url || '';
  return {
    id: entry.id,
    name: name,
    created: entry.createdTime,
    updated: entry.updatedTime,
    url: url
  }
};

module.exports = new Voluum();