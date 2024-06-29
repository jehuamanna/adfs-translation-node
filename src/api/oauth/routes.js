const oauthRouter = require('express').Router();
const { oauth, oauthAuth, oauthRedirect, oauthError } = require('./controller');
const {passport} = require('../../middlewares/passport');

oauthRouter.get('/', oauth);
oauthRouter.get('/login', passport.authenticate('oauth2'));
oauthRouter.get('/auth', passport.authenticate('oauth2'), oauthAuth);
oauthRouter.get('/redirect', oauthRedirect);
oauthRouter.get('/error', oauthError);

module.exports = oauthRouter;
