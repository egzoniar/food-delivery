const express = require('express');
const router = express.Router();

// Middleware reference
const adminAuth = require('../middleware/admin_middleware')

// Controller reference
const DriversController = require('../controllers/driver')

// Add Driver
router.post('/addDriver', adminAuth, DriversController.add_driver) //

// List drivers
router.get('/getDrivers', DriversController.get_drivers) // adminAuth -> i hekum 

// Login driver
router.post('/driverLogin', DriversController.driver_login) //

module.exports = router;