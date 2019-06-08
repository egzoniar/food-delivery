const express = require('express');
const router = express.Router();

// Middleware reference
const adminIsAuth = require('../middleware/admin_middleware')

const UsersController = require('../controllers/user')

// Get all users
router.get('/getUsers', adminIsAuth, UsersController.get_users) //

// Get single user by ID
router.get('/singleUser/:userId', adminIsAuth, UsersController.get_single_user) //

// Get user by phone number
router.get('/getUserByPhone/:phone', UsersController.get_user_by_phone) //

// Add User (Register)
router.post('/userSignup', UsersController.user_signup); //

// User login
router.post('/login', UsersController.user_login) //

// Ban a user
router.patch('/banUser/:phoneNo', adminIsAuth, UsersController.ban_user)

// Unban a user
router.patch('/unbanUser/:phoneNo', adminIsAuth, UsersController.unban_user)

module.exports = router;