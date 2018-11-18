import weauthjs from 'weauthjs';

const api = weauthjs.Initialize({
  app: process.env.AUTH_API_CLIENT_ID,
  baseURL: process.env.AUTH_URL,
  callbackURL: process.env.AUTH_API_REDIRECT_URL,
});

if(typeof window !== 'undefined'){
	window.weauthjs = weauthjs
	window.weauthjsInstance = api
}

export default api;
