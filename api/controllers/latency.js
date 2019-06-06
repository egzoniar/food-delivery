const mongoose = require('mongoose')
const Latency = require('../models/latency')

// Get latency
exports.get_latency = (req, res, next) => {
  Latency.find()
    .exec()
    .then(data => {
      res.status(200).json(data[0])
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

// Add latency
exports.add_latency = (req, res, next) => {
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

}

// Update latency
exports.update_latency = (req, res, next) => {
  // const id = req.params.latencyId
  // console.log("Time:: " + req.params.time)
  Latency.updateOne({}, {time: req.body.time})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}