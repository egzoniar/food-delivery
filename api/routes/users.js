const express = require('express');
const router = express.Router();

// Middleware reference
const adminIsAuth = require('../middleware/admin_middleware')

const UsersController = require('../controllers/user')

// Get all unbanned users
router.get('/getUsers', UsersController.get_users) //adminIsAuth (e hekme) 

// Get all banned users
router.get('/getBannedUsers', UsersController.get_banned_users) //adminIsAuth (e hekme) 

// Get single user by ID
router.get('/singleUser/:userId', adminIsAuth, UsersController.get_single_user) //

// check if user is banned 
router.get('/isUserBanned/:id', UsersController.is_user_banned)

// Get user by phone number
router.get('/getUserByPhone/:phone', UsersController.get_user_by_phone) //

// Add User (Register)
router.post('/userSignup', UsersController.user_signup); //

// User login
router.post('/login', UsersController.user_login) //

// Ban a user
router.patch('/banUser/:phoneNo', UsersController.ban_user) //adminIsAuth (E hekme)

// Unban a user
router.patch('/unbanUser/:phoneNo', UsersController.unban_user) //adminIsAuth (E hekme)

// Update a user
router.patch('/updateUser/:phoneNo', UsersController.update_user)

module.exports = router;