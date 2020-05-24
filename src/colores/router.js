'use strict';

// Router
const router = require('express').Router();
const colores = require('./index');

// Colores
router.get('/:id', colores.findById);
router.get('/', colores.findAll);
// router.post('/', colores.buggyRoute);

// Export router
module.exports = router;
