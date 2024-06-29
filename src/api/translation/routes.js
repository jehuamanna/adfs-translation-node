const oauthRouter = require('express').Router();
const { oauth, oauthAuth, oauthRedirect } = require('./controller');
const {passport} = require('../../middlewares/passport');

oauthRouter.get('/', oauth);
oauthRouter.get('/login', passport.authenticate('oauth2'));
oauthRouter.get('/auth', passport.authenticate('oauth2'), oauthAuth);
oauthRouter.get('/redirect', oauthRedirect);


module.exports = oauthRouter;
