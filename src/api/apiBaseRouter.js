const healthCheckRouter = require('./health-check/routes');
const oauthRouter = require('./oauth/routes');
const apiBaseRouter = require('express').Router();

// Exposed endpoints
apiBaseRouter.use('/health-check', healthCheckRouter);
apiBaseRouter.use('/', oauthRouter);


module.exports = apiBaseRouter;
