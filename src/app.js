require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('middlewares/errorHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {passport} = require('./middlewares/passport');
const bodyParser = require('body-parser');
const translation = require('./api/translation/controller');
const { oauth, oauthAuth, oauthRedirect, oauthError} = require('./api/oauth/controller');

const app = express();

// Security middlewares

// Common Middlewares
app.use(cors());


const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

// oauth routes
app.get('/', oauth);
app.get('/login', passport.authenticate('oauth2'));
app.get('/auth', passport.authenticate('oauth2'), oauthAuth);
app.get('/redirect', oauthRedirect);
app.get('/error', oauthError);

// language translation routes
app.get('/translations/all-translations', translation.getAlltranslation);
app.post('/translations/all-translations', translation.updateTranslation);
app.get('/translations/language/version/:lang', translation.getLanguageVersion);
app.get('/translations/language/:lang', translation.getLanguageData);


// Error handler
app.use(errorHandler);

module.exports = app;
