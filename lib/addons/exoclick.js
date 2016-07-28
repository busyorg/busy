var axios = require('axios');

var Exoclick = function(){};

Exoclick.prototype.login = function(callback){
  axios.post('https://api.exoclick.com/v1/login', {params: {username: 'adcpm', password: 'Password22'}}).then(function (response) {
      callback(response);
    }
  );
  return this;
};

Exoclick.prototype.campaigns = function(token, callback){
  request({url: 'https://api.exoclick.com/v1/campaigns', headers: {'Authorization': token}}, function (error, response, body) {
      callback(JSON.parse(body));
    }
  );
  return this;
};

Exoclick.prototype.report = function(token, options, callback){
  options = '?' +
    Object.keys(options).map(function(key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(options[key]);
    }).join('&');
  request({url: 'https://reports.voluum.com/report' + options, headers: {'cwauth-token': token}}, function (error, response, body) {
      callback(
        this.parse(JSON.parse(body))
      );
    }.bind(this)
  );
  return this;
};

Exoclick.prototype.parse = function(data){
  if (!data.rows) {
    return [];
  }
  return {
    entries: this.parseEntries(data.rows),
    total: this.parseEntry(data.totals)
  }
};

Exoclick.prototype.parseEntries = function(entries){
  if (!entries) {
    return [];
  }
  return Object.keys(entries).map(function(key) {
    return this.parseEntry(entries[key]);
  }.bind(this));
};

Exoclick.prototype.parseEntry = function(entry){
    var id = entry.campaignId || entry.trafficSourceId || entry.flowId || entry.offerId || entry.affiliateNetworkId;
    var name = entry.campaignNamePostfix || entry.campaignName || entry.trafficSourceName || entry.flowName || entry.offerName || entry.affiliateNetworkName
      || entry.countryName || entry.device || entry.os || entry.browser;
    return {
      id: id,
      name: name,
      created: entry.created,
      updated: entry.updated,
      imp: entry.impressions,
      clicks: entry.clicks,
      leads: entry.conversions,
      cost: entry.cost,
      revenue: entry.revenue,
      profit: entry.profit
    }
};

module.exports = new Exoclick();