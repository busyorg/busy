var axios = require('axios');

module.exports = {
	getConfig: function (callback) {
		axios.get('//api.steemjs.com/getConfig')
			.then(response => {
				callback('', response.data);
			});
	},
	getAccount: function (username, callback) {
		axios.get('//api.steemjs.com/getAccounts?names[]=' + username)
			.then(response => {
				callback('', response.data[0]);
			});
	},
	getContent: function (author, permlink, callback) {
		axios.get('//api.steemjs.com/getContent?author=' + author + '&permlink=' + permlink)
			.then(response => {
				callback('', response.data);
			});
	},
	getContentReplies: function (parent, parentPermlink, callback) {
		axios.get('//api.steemjs.com/getContentReplies?parent=' + parent + '&parentPermlink=' + parentPermlink)
			.then(response => {
				callback('', response.data);
			});
	},
	getState: function (path, scope, callback) {
		var url = '//api.steemjs.com/getState?path=' + path;
		url = (scope.length > 0)? url + '&scope=' + scope : url;
		axios.get(url)
			.then(response => {
				callback('', response.data);
			});
	},
	getFollowers: function (following, startFollower, followType, limit, callback) {
		startFollower = startFollower || 0;
		followType = followType || 'blog';
		limit = limit || 50;
		axios.get('//api.steemjs.com/getFollowers?following=' + following + '&startFollower=' + startFollower + '&followType=' + followType + '&limit=' + limit)
			.then(response => {
				callback('', response.data);
			});
	},
	getFollowing: function (follower, startFollowing, followType, limit, callback) {
		startFollowing = startFollowing || 0;
		followType = followType || 'blog';
		limit = limit || 50;
		axios.get('//api.steemjs.com/getFollowing?follower=' + follower + '&startFollowing=' + startFollowing + '&followType=' + followType + '&limit=' + limit)
			.then(response => {
				callback('', response.data);
			});
	}
};