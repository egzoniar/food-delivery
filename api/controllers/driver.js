const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/driver");

exports.add_driver = (req, res, next) => {
  Driver.find({ username: req.body.username })
    .exec()
    .then(doc => {
      if (doc.length >= 1) {
        return res.status(409).json({
          message: "Driver with this name exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const driver = new Driver({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            });
            driver
              .save()
              .then(data => {
                res.status(201).json({
                  message: "Driver is created",
                  createdDriver: driver
                });
              })
              .catch(err => {
                res.status(500).json(err);
              });
          }
        });
      }
    });
};

exports.get_drivers = (req, res, next) => {
  Driver.find()
    .exec()
    .then(data => {
      console.log(data);
      res.status(201).json(data);
    })
    .catch();
};

exports.driver_login = (req, res, next) => {
  const password = req.body.password;
  Driver.findOne({
    username: req.body.username
  })
    .exec()
    .then(drivers => {
      if (drivers.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(password, drivers.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Fjalekalimi eshte dhene gabim!"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: drivers.username,
              password: drivers.password
            },
            "fresca_drivers"
          );

          return res.status(200).json({
            message: "Auth successful",
            token: token,
            driver: drivers
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: {
          status: 500
        },
        status: "500"
      });
    });
};
