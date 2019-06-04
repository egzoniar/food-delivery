
const mongoose = require('mongoose')
const express = require('express');

const router = express.Router();
const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')

const userIsAuth = require('../middleware/users_middleware')
const adminIsAuth = require('../middleware/admin_middleware')
const driverIsAuth = require('../middleware/drivers_middleware')

// Get orders by driver ID
router.get('/listOrdersByDriverID/:driverId', adminIsAuth, (req, res, next) => {
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
})

// Get active orders
router.get('/listActiveOrders', adminIsAuth, (req, res, next) => {
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
});

// Get archived orders
router.get('/listArchivedOrders', adminIsAuth, (req, res, next) => {
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
});

// Get prepared orders
router.get('/listPrepOrders', driverIsAuth, (req, res, next) => {
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
});


// Get inMaking orders
router.get('/listInMakingOrders', adminIsAuth, (req, res, next) => {
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
});

// Add Order
router.post('/makeOrder', userIsAuth, async (req, res, next) => {

  if (!(Array.isArray(req.body.items) && req.body.items.length)) {
    res.status(500).json({
      message: "It must be an Array and it can't be empty!"
    })
    return;
  }

  const orderObj = {
    _id: new mongoose.Types.ObjectId(),
    location: {
      type: "Point",
      coordinates: [122.23, 24.5]
    },
    active: true,
    inMaking: true,
    user: req.body.user
  }

  let tmp = []
  for (let item of req.body.items) {
    const prod = await getProdData(item.productId)

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


});

// Take an order
router.put('/takeAnOrder/:orderId', driverIsAuth, async (req, res, next) => {
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
})

function getProdData(id) {
  return prodRes = Product.findById({
      _id: id
    })
    .then(res => {
      return res
    })
    .catch(err => {
      throw new Error("HHSHSHSHS")
    })
}

router.patch('/archiveOrder/:orderId', driverIsAuth, (req, res, next) => {
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
})

router.patch('/inMaking/:orderId', adminIsAuth, (req, res, next) => {
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
})



module.exports = router;