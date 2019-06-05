const express = require('express');
const router = express.Router();

// Middleware reference
const adminIsAuth = require('../middleware/admin_middleware')

// Get all users
router.get('/listUsers', adminIsAuth, get_users);

// Get single user by ID
router.get('/singleUser/:userId', adminIsAuth, get_single_user)

// Get user by phone number
router.get('/getUserByPhone/:phone', get_user_by_phone)

// Add User (Register)
router.post('/userSignup', user_signup);

// User login
router.post('/login', user_login)

module.exports = router;