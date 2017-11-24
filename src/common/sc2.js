const fetch = require('isomorphic-fetch');

class SDKError extends Error {
  constructor(message, obj) {
    super(message);
    this.name = 'SDKError';
    this.error = obj.error;
    this.error_description = obj.error_description;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

function SteemConnect() {
  this.options = {
    baseURL: 'https://v2.steemconnect.com',
    app: '',
    callbackURL: '',
    scope: [],
  };
}

SteemConnect.prototype.setBaseURL = function setBaseURL(baseURL) {
  this.options.baseURL = baseURL;
};
SteemConnect.prototype.setApp = function setApp(app) {
  this.options.app = app;
};
SteemConnect.prototype.setCallbackURL = function setCallbackURL(callbackURL) {
  this.options.callbackURL = callbackURL;
};
SteemConnect.prototype.setAccessToken = function setAccessToken(accessToken) {
  this.options.accessToken = accessToken;
};
SteemConnect.prototype.removeAccessToken = function removeAccessToken() {
  this.options.accessToken = undefined;
};
SteemConnect.prototype.setScope = function setScope(scope) {
  this.options.scope = scope;
};

SteemConnect.prototype.getLoginURL = function getLoginURL(state) {
  let loginURL = `${this.options.baseURL}/oauth2/authorize?client_id=${
    this.options.app
  }&redirect_uri=${encodeURIComponent(this.options.callbackURL)}`;
  loginURL += this.options.scope ? `&scope=${this.options.scope.join(',')}` : '';
  loginURL += state ? `&state=${encodeURIComponent(state)}` : '';
  return loginURL;
};

SteemConnect.prototype.send = function send(route, method, body, cb) {
  const url = `${this.options.baseURL}/api/${route}`;
  const promise = fetch(url, {
    method,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: this.options.accessToken,
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      const json = res.json();
      // If the status is something other than 200 we need
      // to reject the result since the request is not considered as a fail
      if (res.status !== 200) {
        return json.then(result => Promise.reject(new SDKError('sc2-sdk error', result)));
      }
      return json;
    })
    .then((res) => {
      if (res.error) {
        return Promise.reject(new SDKError('sc2-sdk error', res));
      }
      return res;
    });

  if (!cb) return promise;

  return promise.then(res => cb(null, res)).catch(err => cb(err, null));
};

SteemConnect.prototype.broadcast = function broadcast(operations, cb) {
  return this.send('broadcast', 'POST', { operations }, cb);
};

SteemConnect.prototype.me = function me(cb) {
  return this.send('me', 'POST', {}, cb);
};

SteemConnect.prototype.vote = function vote(voter, author, permlink, weight, cb) {
  const params = {
    voter,
    author,
    permlink,
    weight,
  };
  return this.broadcast([['vote', params]], cb);
};

SteemConnect.prototype.comment = function comment(
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  title,
  body,
  jsonMetadata,
  cb,
) {
  const params = {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author,
    permlink,
    title,
    body,
    json_metadata: JSON.stringify(jsonMetadata),
  };
  return this.broadcast([['comment', params]], cb);
};

SteemConnect.prototype.reblog = function reblog(account, author, permlink, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [account],
    id: 'follow',
    json: JSON.stringify([
      'reblog',
      {
        account,
        author,
        permlink,
      },
    ]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.follow = function follow(follower, following, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['blog'] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.unfollow = function unfollow(unfollower, unfollowing, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [unfollower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower: unfollower, following: unfollowing, what: [] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.ignore = function ignore(follower, following, cb) {
  const params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following, what: ['ignore'] }]),
  };
  return this.broadcast([['custom_json', params]], cb);
};

SteemConnect.prototype.claimRewardBalance = function claimRewardBalance(
  account,
  rewardSteem,
  rewardSbd,
  rewardVests,
  cb,
) {
  const params = {
    account,
    reward_steem: rewardSteem,
    reward_sbd: rewardSbd,
    reward_vests: rewardVests,
  };
  return this.broadcast([['claim_reward_balance', params]], cb);
};

SteemConnect.prototype.revokeToken = function revokeToken(cb) {
  return this.send('oauth2/token/revoke', 'POST', { token: this.options.accessToken }, cb).then(
    () => this.removeAccessToken(),
  );
};

SteemConnect.prototype.updateUserMetadata = function updateUserMetadata(metadata = {}, cb) {
  return this.send('me', 'PUT', { user_metadata: metadata }, cb);
};

SteemConnect.prototype.sign = function sign(name, params, redirectUri) {
  if (typeof name !== 'string' || typeof params !== 'object') {
    return new SDKError('sc2-sdk error', {
      error: 'invalid_request',
      error_description: 'Request has an invalid format',
    });
  }
  let url = `${this.options.baseURL}/sign/${name}?`;
  url += Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  url += redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : '';
  return url;
};

function Initialize(config) {
  const instance = new SteemConnect();

  if (!config) {
    throw new Error('You have to provide config');
  }

  if (typeof config !== 'object') {
    throw new Error('Config must be an object');
  }

  if (config.baseURL) instance.setBaseURL(config.baseURL);
  if (config.app) instance.setApp(config.app);
  if (config.callbackURL) instance.setCallbackURL(config.callbackURL);
  if (config.accessToken) instance.setAccessToken(config.accessToken);
  if (config.scope) instance.setScope(config.scope);

  return instance;
}

export default {
  Initialize,
};
