import sc2 from 'sc2-sdk';

export default sc2.Initialize({
  app: process.env.STEEMCONNECT_CLIENT_ID,
  baseURL: process.env.STEEMCONNECT_HOST,
  callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
});
