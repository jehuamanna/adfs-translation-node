/* eslint-disable no-console */
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const strategy = new OAuth2Strategy(
  {
    authorizationURL: process.env.AUTHORIZATION_URL,
    tokenURL: process.env.TOKEN_URL,
    clientID: process.env.CLIENT_ID, // This is just a UID I generated and registered
    clientSecret: process.env.CLIENT_SECRET, // This is ignored but required by the OAuth2Strategy
    callbackURL: process.env.CALLBACK_URL,
    pkce: true,
    state: true,
    store: true,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    // const token = accessToken;
    if (refreshToken) {
      // console.log('Received but ignoring refreshToken (truncated)', refreshToken.substr(0, 25));
    } else {
      console.log('No refreshToken received');
    }
    done(null, accessToken);
  },
);
strategy.authorizationParams = function () {
  return {
    //    resource: 'urn:relying:party:trust:identifier' // An identifier corresponding to the RPT
    response_type: 'code',
    response_mode: 'query',
    scope: 'openid',
    state: 'thisisfromflutterflowApplication',
  };
};
strategy.userProfile = function (accessToken, done) {
  done(null, accessToken);
};

passport.use('oauth2', strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = {
  passport,
  strategy,
};
