'use strict';

// Router
const router = require('express').Router();
const colores = require('./index');

// Colores
router.get('/:id', colores.findById);
router.get('/', colores.findAll);
router.post('/create', colores.createOne);

// Export router
module.exports = router;
