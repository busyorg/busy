var async = require('async'),
	_ = require('lodash'),
  moment = require('moment'),
  sortBy = require('sort-by'),
  bandit = require('./../lib/bandit'),
  token = require('./../lib/token'),
  bt4 = require('./../lib/addons/bt4'),
  voluum = require('./../lib/addons/voluum');

var types = ['campaign', 'traffic_source', 'flow', 'offer', 'affiliate_network'];

var Report = function(){};

Report.prototype.get = function(userId, options, callback){
  options.from = options.from || moment().subtract(6, 'months').startOf('day').utcOffset(0).format();
  options.to = options.to || moment().startOf('day').add(1, 'day').utcOffset(0).format();

	var addon = '';
	var ids = ['campaignId', 'trafficSourceId', 'flowId', 'landerId', 'offerId', 'affiliateNetworkId'];
	ids.forEach(function(entry) {
		if (options[entry]) {
			var id = options[entry].split(':');
			options[entry] = id[1];
			addon = id[0];
		}
	});

  var tasks = {};
  if (!addon || addon == 'voluum') {
	  tasks.voluum = function(callback) {
	    token.get(userId, 'voluum', function(token) {
	      voluum.report(token, options, function(response) {
	        callback('', response);
	      });
	    });
	  };
  }
	if (!addon || addon == 'bt4') {
		tasks.bt4 = function (callback) {
			bt4.report(userId, options, function (response) {
				callback('', response);
			});
		};
	}

  async.parallel(tasks, function(err, response){
		var report = this._concat(response);
	  var entries = bandit.getBayesian(report.entries);
	  entries = entries.sort(sortBy('-imp', 'updated'));
	  report.entries = entries;
    callback(report);
  }.bind(this));
};

Report.prototype._concat = function(reports){
	var report = {
		entries: [],
		total: {
			imp: 0,
			clicks: 0,
			leads: 0,
			roi: 0,
			cost: 0,
			revenue: 0,
			profit: 0
		}
	};
	if (reports.bt4) {
		report.entries = _.concat(report.entries, reports.bt4.entries);
		for (var key in reports.bt4.total) {
			report.total[key] += reports.bt4.total[key];
		}
	}
	if (reports.voluum) {
		report.entries = _.concat(report.entries, reports.voluum.entries);
		for (var key in reports.voluum.total) {
			report.total[key] += reports.voluum.total[key];
		}
	}
	return report;
};

Report.prototype.campaign = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
	  token.get(userId, 'voluum', function(token) {
	    voluum.campaign(token, options, function(response) {
	      callback({entry: response});
	    });
	  });
	}
	if (id[0] == 'bt4') {
		bt4.campaign(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

Report.prototype.trafficSource = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
		token.get(userId, 'voluum', function(token) {
			voluum.trafficSource(token, options, function(response) {
				callback({entry: response});
			});
		});
	}
	if (id[0] == 'bt4') {
		bt4.trafficSource(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

Report.prototype.flow = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
		token.get(userId, 'voluum', function(token) {
			voluum.flow(token, options, function(response) {
				callback({entry: response});
			});
		});
	}
	if (id[0] == 'bt4') {
		bt4.flow(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

Report.prototype.lander = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
		token.get(userId, 'voluum', function(token) {
			voluum.lander(token, options, function(response) {
				callback({entry: response});
			});
		});
	}
	if (id[0] == 'bt4') {
		bt4.lander(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

Report.prototype.offer = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
		token.get(userId, 'voluum', function (token) {
			voluum.offer(token, options, function (response) {
				callback({entry: response});
			});
		});
	}
	if (id[0] == 'bt4') {
		bt4.offer(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

Report.prototype.affiliateNetwork = function(userId, options, callback){
	var id = options.id.split(':');
	options.id = id[1];
	if (id[0] == 'voluum') {
		token.get(userId, 'voluum', function(token) {
			voluum.affiliateNetwork(token, options, function(response) {
				callback({entry: response});
			});
		});
	}
	if (id[0] == 'bt4') {
		bt4.affiliateNetwork(userId, options, function(response) {
			callback({entry: response});
		});
	}
};

module.exports = new Report();