
const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Sasia nuk mund te jete zero']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Cmimi nuk mund te jete me i ulet se zero']
  },
  size: {
    type: String,
    required: true
  }
})


const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  active: {
    type: Boolean
  },
  inMaking: {
    type: Boolean
  },
  done: {
    type: Boolean
  },
  orderTotal: Number,
  items: [itemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);