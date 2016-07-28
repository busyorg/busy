var Bayesian = require('bayesian-bandit').Bandit;

var Bandit = function(){};

Bandit.prototype.getBayesian = function(entries){
  var bandit = new Bayesian({numberOfArms: entries.length});
  var results = [];
  
  entries.forEach(function(entry, i) {
    var totalValue = entry.profit;
    bandit.arms[i].rewardMultiple(entry.clicks, totalValue);
    results[i] = 0;
  });

  for (var i = 0; i < 100000; i++) {
    var arm = bandit.selectArm();
    results[arm]++;
  }

  entries.forEach(function(entry, i) {
    entries[i].bayesian = results[i]/100000;
  });
  
  return entries;
};

module.exports = new Bandit();