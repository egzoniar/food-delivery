const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/admin')



exports.add_admin = (req, res, next) => {
  Admin.find({username: req.body.username})
    .exec()
    .then(doc => {
      if(doc.length >= 1) {
        return res.status(409).json({
          message: "Admin with this name exists"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            })
            admin
            .save()
            .then(data => {
              res.status(201).json({
                message: "Admin is created",
                createdDriver: admin
              })
            })
            .catch(err => {
              res.status(500).json(err)
            })
          }
        })
      }
    })
}


exports.admin_login = (req, res, next) => {
  Admin.findOne({
    username: req.body.username
  })
    .exec()
    .then(admin => {
      if(admin.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      bcrypt.compare(req.body.password, admin.password, (err, result) => {
        if(err) {
          return res.status(401).json({
            message: "Auth failed"
          })
        }
        if(result) {
          const token = jwt.sign({
            username: admin.username,
            password: admin.password
          }, 'fresca_admin')

          return res.status(200).json({
            message: "Auth successful",
            token: token
          })
        }
        res.status(401).json({
          message: "Auth failed"
        })
      })
    }) 
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}