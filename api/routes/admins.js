const express = require('express');
const router = express.Router();

// Controller reference
const AdminController = require('../controllers/admin')


// Add admin
router.post('/addAdmin', AdminController.add_admin)

// Login admin
router.post('/adminLogin', AdminController.admin_login)

module.exports = router;