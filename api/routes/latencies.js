const express = require('express');

const router = express.Router();

// Middleware reference
const adminAuth = require('../middleware/admin_middleware')

// Controller reference
const LatencyController = require('../controllers/latency')

// Get Latency
router.get('/getLatency', LatencyController.get_latency) //

// Add Latency
router.post('/addLatency', adminAuth, LatencyController.add_latency)

// Update Latency
router.patch('/updateLatency', adminAuth, LatencyController.update_latency) //

module.exports = router;