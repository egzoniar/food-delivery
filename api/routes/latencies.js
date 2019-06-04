const mongoose = require('mongoose')
const express = require('express');

const router = express.Router();
const Latency = require('../models/latency')
const adminAuth = require('../middleware/admin_middleware')

// Get Latency
router.get('/getLatency', adminAuth, (req, res, next) => {
  Latency.find()
    .exec()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Add Latency
router.post('/addLatency', adminAuth, (req, res, next) => {
  const latency = new Latency({
    _id: new mongoose.Types.ObjectId(),
    time: req.body.time
  })

  latency
    .save()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })

})

// Update Latency
router.patch('/updateLatency:latencyId', adminAuth, (req, res, next) => {
  const id = req.params.latencyId

  Latency.update({_id: id}, {$set: {time: req.body.time}})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

module.exports = router;