const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')


exports.get_driver_by_id = (req, res, next) => {
  const id = req.params.driverId
  Order.find({
    driver: id
  })
  .then(result => {
    res.status(200).json({
      count: result.length,
      myOrders: result
    })
  })
  .catch(err => res.status(500).json(err))
}

exports.get_active_orders = (req, res, next) => {
  Order.find()
    .where("active").equals("true")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

exports.get_archived_orders = (req, res, next) => {
  Order.find()
    .where("active").equals("false")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

exports.get_prep_orders = (req, res, next) => {
  Order.find()
    .where("inMaking").equals("false")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

exports.get_inmaking_orders = (req, res, next) => {
  Order.find()
    .where("inMaking").equals("true")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

exports.make_order = async (req, res, next) => {

  if (!(Array.isArray(req.body.items) && req.body.items.length)) {
    res.status(500).json({
      message: "It must be an Array and it can't be empty!"
    })
    return;
  }

  const userStatus = await User.findById({_id: req.body.user})
  if(userStatus.banned) {
    res.status(500).json({
      message: "This account is banned from admin, you can't make order"
    })
    return;
  }

  const orderObj = {
    _id: new mongoose.Types.ObjectId(),
    location: {
      type: "Point",
      coordinates: req.body.coordinates
    },
    active: true,
    inMaking: true,
    user: req.body.user
  }

  let tmp = []
  for (let item of req.body.items) {
    const prod = await getProdData(item.productId)
    console.log(prod)
    tmp.push({
      productId: item.productId,
      name: prod.name,
      qty: item.qty,
      price: prod.price * item.qty
    })
  }
  orderObj.items = tmp

  let totalPrice = 0;
  orderObj.items.map(item => {
    totalPrice += item.price
  })
  orderObj.orderTotal = totalPrice

  const order = new Order(orderObj)

  order.save()
    .then(result => {
      res.status(201).json({
        createdOrder: result,
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })


  try {
    const author = await User.findById(req.body.user)
    if (!author) {
      throw new Error("User not found!");
    }

    author.orders.push(order)
    await author.save()
  } catch (err) {
    throw err;
  }
}

function userIsBanned(id) {
  // User.findById({_id: id})
  // .exec()
  // .then(result => {
  //   return result.banned
  // })
  // .catch()
  User.findById({_id: id}, (err, user) => {
    console.log(typeof user + " " + user)
  })
}

exports.take_an_order = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId)

  const driverId = req.body.driver

  order.update({
    $set: {
      driver: driverId
    }
  })
  .then(result => {
    res.status(200).json({
      message: "Order was taken"
    })
  })
  .catch(err => res.status(500).json(err))
}

exports.archive_order = (req, res, next) => {
  const id = req.params.orderId

  Order.update({
      _id: id
    }, {
      $set: {
        active: false
      }
    })
    .then(result => {
      res.status(200).json({
        message: "Order was archived",
        updatedOrder: result
      })
    })
    .catch(err => res.status(500).json(err))
}

exports.inmaking = (req, res, next) => {
  const id = req.params.orderId

  Order.update({
      _id: id
    }, {
      $set: {
        inMaking: false
      }
    })
    .then(result => {
      res.status(200).json({
        message: "Order is ready to be delivered",
        updatedOrder: result
      })
    })
    .catch(err => res.status(500).json(err))
}

function getProdData(id) {
  try {
    const prod = Product.findById(id)
    if (!prod) {
      throw new Error("Product not found!");
    }

    return prod
    
  } catch (err) {
    throw err;
  }
}

exports.filter = (req, res) => {
  const prefix = req.params.prefix

  const opts = getDate(prefix)
  console.log(opts)

  Order.find({ createdAt: opts })
  .populate('Order.itemSchema')
  .exec()
  .then(result => {
    res.status(200).json({
      message: prefix + " Orders",
      count: "Total number of orders this " + prefix + ": " + result.length,
      orders: result
    })
  })
  .catch(err => res.status(401).json(err))
}

function getDate(prefix) {
  const jsDate = new Date()
  let opts = {}
  const day = (jsDate.getDate() === 1) ? 1 : (jsDate.getDate() - (jsDate.getDay()))

  if(prefix === 'week') {
    opts.$gte = new Date(jsDate.getFullYear() + '-' + (jsDate.getMonth()+1) + '-' + day)
  }
  else if(prefix === 'day') {
    opts.$gte = new Date(jsDate.getFullYear() + '-' + (jsDate.getMonth()+1) + '-' + jsDate.getDate())
  }

  return opts
}

exports.filter_full_date = (req, res) => {
  const date = new Date(req.params.date);
  const dateMin = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate())
  const dateMax = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate()+1)
  Order.find({ createdAt: {$gte: dateMin, $lt: dateMax} })
  .populate('Order.itemSchema')
  .exec()
  .then(result => {
    res.status(200).json({
      count: result.length,
      orders: result
    })
  })
  .catch(err => res.status(401).json(err))

}