import sc2 from 'sc2-sdk';

const api = sc2.Initialize({
  app: process.env.AUTH_API_CLIENT_ID,
  baseURL: process.env.STEEMCONNECT_HOST,
  callbackURL: process.env.AUTH_API_REDIRECT_URL,
});

export default api;
