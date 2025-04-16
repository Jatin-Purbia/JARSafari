const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map.controller');

router.get('/get-coordinate', mapController.getAddressCoordinate);
router.get('/get-route', mapController.getRoute);

module.exports = router;
