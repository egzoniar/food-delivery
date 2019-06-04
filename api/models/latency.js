const mongoose = require('mongoose');

const latencySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  time: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Latency', latencySchema);