var moment = require('moment'),
  con = require('./../db'),
  voluum = require('./../lib/addons/voluum');

var Token = function(){};

Token.prototype.get = function(userId, slug, callback){
  var self = this;
  con.query("SELECT * FROM token WHERE user_id = ? AND slug = ? LIMIT 1", [userId, slug], function(error, results, fields) {
    if (!results[0]) {
      return;
    }
    var token = results[0];
    var offset = new Date();
    offset = offset.getTimezoneOffset();
    var from = moment(token.updated);
    var to = moment().add(offset, 'minutes');
    var diff = to.diff(from, 'minutes');
    if (token.slug == 'voluum') {
      if (!token.token || diff > 15) {
        console.log('Generate New Token');
        voluum.getToken(JSON.parse(token.params), function(response) {
          self.save(userId, slug, response.token, function (error, result) {
            callback(response.token);
          });
        });
      } else {
        callback(token.token);
      }
    }
  });
};

Token.prototype.save = function(userId, slug, token, callback){
  con.query('UPDATE token SET token = ? WHERE user_id = ? AND slug = ?', [token, userId, slug], function(error, result) {
    callback(error, result);
  });
};

module.exports = new Token();