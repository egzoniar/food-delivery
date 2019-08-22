const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const USERS_PER_PAGE = 1

// Get all unbanned users
exports.get_users = (req, res, next) => {
  const page = req.query.page

  User.find()
    .skip((page - 1) * USERS_PER_PAGE)
    .limit(USERS_PER_PAGE)
    .populate('orders', 'location user items.price orderTotal')
    .where("banned")
    .equals("false")
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}


// Get all banned users
exports.get_banned_users = (req, res, next) => {
  User.find()
    .populate('orders', 'location user items.price orderTotal')
    .where("banned")
    .equals("true")
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.is_user_banned = (req, res, next) => {
  const id = req.params.id
  User.findOne({ _id: id }, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      })
      return
    }
    if (result) {
      res.status(200).json({
        message: "this user is banned",
        banned: result.banned
      })
    } else {
      res.status(201).json({
        message: "this phone nr does not exist",
        exists: false
      })
    }
  })
    .select('banned')
    .lean()
    .exec()
}


// Get single user by ID
exports.get_single_user = (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .populate('orders', 'location user items.price orderTotal')
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
}


// Get user by phone number
exports.get_user_by_phone = (req, res, next) => {

  const phone = req.params.phone

  // Check if phone number exists in db
  User.findOne({ phone: phone }, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err
      })
    }
    if (result) {
      res.status(200).json({
        message: "this phone nr exists",
        user: result,
        exists: true
      })
    } else {
      res.status(201).json({
        message: "this phone nr does not exist",
        exists: false
      })
    }
  })
    .select('name lastname phone email banned')
    .lean()
    .exec()
}


// User signup
exports.user_signup = (req, res, next) => {
  User.find({ phone: req.body.phone })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "user with this number exists",
          user: user
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          name: req.body.name,
          lastname: req.body.lastname,
          phone: req.body.phone,
          email: req.body.email,
          banned: false
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
}

// User login
exports.user_login = (req, res) => {
  User.findOne({
    phone: req.body.phone
  })
    .exec()
    .then(users => {
      if (users.length < 1) {
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
}


// Ban user
exports.ban_user = (req, res) => {
  const phoneNo = req.params.phoneNo

  User.update({
    phone: phoneNo
  }, {
      $set: {
        banned: true
      }
    })
    .then(result => {
      res.status(200).json({
        message: "User is banned!"
      })
    })
    .catch(err => res.status(500).json(err))
}

// Unban user
exports.unban_user = (req, res) => {
  const phoneNo = req.params.phoneNo

  User.update({
    phone: phoneNo
  }, {
      $set: {
        banned: false
      }
    })
    .then(result => {
      res.status(200).json({
        message: "User is unbanned!"
      })
    })
    .catch(err => res.status(500).json(err))
}

// Update user
exports.update_user = (req, res, next) => {
  const phone = req.params.phoneNo
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  User
    .findOneAndUpdate({ phone: phone }, { $set: updateOps }, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json(err)
      }
      if (doc) {
        return res.status(200).json(doc)
      }
    })
    .select('name lastname phone email')
    .lean()
    .exec()
}