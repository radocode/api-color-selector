'use strict';

const router = require('express').Router();
const middleware = require('./src/middleware');
const errors = require('./src/errors');
const healthRouter = require('./src/health/router');
const coloresRouter = require('./src/colores/router');

// Wire up middleware
router.use(middleware.checkXml);

// Wire up routers
router.use('/health', healthRouter);
router.use('/colores', coloresRouter);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

// Export the router
module.exports = router;
