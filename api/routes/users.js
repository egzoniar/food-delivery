const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router();
const User = require('../models/user')

const adminIsAuth = require('../middleware/admin_middleware')
// Get Users
router.get('/listUsers', adminIsAuth, (req, res, next) => {
  User.find()
    .populate('orders', 'location user items.price orderTotal')
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

//get user with id
router.get('/singleUser/:userId', adminIsAuth, (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .exec()
    .then(data => {
      console.log(data)
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({
          message: "No valid entry was found for provided ID!"
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

// Get phone number
router.get('/findbyphone/:phone', (req, res, next) => {

  const phone = req.params.phone

  // Check if phone number exists in db
  User.findOne({phone: phone}, (err, result) => {
    if(err) {
      res.status(500).json({
        error: err
      })
    }
    if(result) {
      res.status(200).json({
        message: "this phone nr exists",
        user: result
      })
    } else {
      res.status(200).json({
        message: "this phone nr does not exist"
      })
    }
    
  })
})

// Add User (Register)
router.post('/signup', (req, res, next) => {
  User.find({phone: req.body.phone})
    .exec()
    .then(user => {
      if(user.length >= 1) {
        return res.status(409).json({
          message: "user with this number exists",
          user: user
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email
        })

        user.save()
          .then(result => {
            res.status(201).json({
              message: "User is created",
              createdUser: user
            })
          })
          .catch()      
      }
    })
});

// User login
router.post('/login', (req, res) => {
  User.findOne({
    phone: req.body.phone
  })
  .exec()
  .then(users => {
    if(users.length < 1) {
      return res.status(401).json({
        message: "Login failed"
      })
    }
    const token = jwt.sign({
      user: users
    }, 'fresca_users')

    return res.status(200).json({
      message: "Auth successful",
      token: token
    })
  })
})

module.exports = router;