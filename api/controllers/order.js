const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.get_driver_by_id = (req, res, next) => {
  const id = req.params.driverId;
  Order.find({
    driver: id
  })
    .then(result => {
      res.status(200).json({
        count: result.length,
        myOrders: result
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.get_active_orders = (req, res, next) => {
  console.log(req);
  Order.find()
    .where("active")
    .equals("true")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_archived_orders = (req, res, next) => {
  Order.find()
    .where("active")
    .equals("false")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

// Get orders that are ready to deliver
exports.get_prep_orders = (req, res, next) => {
  Order.find()
    .where("driver")
    .equals(null)
    .where("done")
    .equals("true")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_notinmaking_orders = (req, res, next) => {
  Order.find()
    .where("inMaking")
    .equals("false")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_inmaking_orders = (req, res, next) => {
  Order.find()
    .where("inMaking")
    .equals("true")
    .where("done")
    .equals("false")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.get_inmaking_orders_driver = (req, res, next) => {
  Order.find()
    .where("driver")
    .ne(null)
    .where("done")
    .equals("true")
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        orders: data
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.make_order = async (req, res, next) => {
  
  if (!(Array.isArray(req.body.items) && req.body.items.length)) {
    res.status(500).json({
      message: "It must be an Array and it can't be empty!"
    });
    return;
  }

  // Order cannot be made if user is banned from admin
  const userStatus = await User.findById({ _id: req.body.user });
  if (userStatus.banned) {
    res.status(500).json({
      message: "This account is banned from admin, you can't make order"
    });
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
    distance: req.body.distance,
    done: false,
    user: req.body.user,
    driver: null
  };

  let tmp = [];
  for (let item of req.body.items) {
    const prod = await getProdData(item.productId);
    let prodPrice;
    // If size of item is small than take price in index 0
    if (item.size === "s") {
      prodPrice = prod.price[0];
    } else {
      prodPrice = prod.price[1];
    }
    // const prodPrice = (item.size === 's') ? prod.price[0] : prod.price[1]

    tmp.push({
      productId: item.productId,
      name: prod.name,
      qty: item.qty,
      productPrice: prodPrice,
      price: prodPrice * item.qty,
      size: item.size
    });
  }
  orderObj.items = tmp;

  let totalPrice = 0;
  orderObj.items.map(item => {
    totalPrice += item.price;
  });
  orderObj.orderTotal = totalPrice;

  const order = new Order(orderObj);

  order
    .save()
    .then(result => {
      res.status(201).json({
        createdOrder: result
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });

  try {
    const author = await User.findById(req.body.user);
    if (!author) {
      throw new Error("User not found!");
    }

    author.orders.push(order);
    await author.save();
  } catch (err) {
    throw err;
  }
};

function getProdData(id) {
  try {
    const prod = Product.findById(id);
    if (!prod) {
      throw new Error("Product not found!");
    }

    return prod;
  } catch (err) {
    throw err;
  }
}

// A specific driver takes an order to deliver
exports.take_an_order = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  const orderData = order.data;
  const driverId = req.body.driver;

  order
    .update({
      $set: {
        driver: driverId
      }
    })
    .then(result => {
      res.status(200).json({
        message: "Order was taken",
        result: result,
        order: orderData
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.drop_an_order = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  const orderData = order.data;

  order
    .update({
      $set: {
        driver: null
      }
    })
    .then(result => {
      res.status(200).json({
        message: "Order was dropped",
        result: result,
        order: orderData
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.archive_order = (req, res, next) => {
  const id = req.params.orderId;

  Order.update(
    {
      _id: id
    },
    {
      $set: {
        active: false
      }
    }
  )
    .then(result => {
      res.status(200).json({
        message: "Order was archived",
        updatedOrder: result
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.inmaking = (req, res, next) => {
  const id = req.params.orderId;

  Order.update(
    {
      _id: id
    },
    {
      $set: {
        inMaking: true
      }
    }
  )
    .then(result => {
      res.status(200).json({
        message: "Order is in making",
        updatedOrder: result
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.done = (req, res, next) => {
  const id = req.params.orderId;

  Order.update(
    {
      _id: id
    },
    {
      $set: {
        done: true
      }
    }
  )
    .then(result => {
      res.status(200).json({
        message: "Order is Done, it is ready to deliver",
        updatedOrder: result
      });
    })
    .catch(err => res.status(500).json(err));
};

exports.filter = (req, res) => {
  const prefix = req.params.prefix;

  const opts = getDate(prefix);
  console.log(opts);

  Order.find({ createdAt: opts })
    .populate("Order.itemSchema")
    .exec()
    .then(result => {
      res.status(200).json({
        message: prefix + " Orders",
        count: "Total number of orders this " + prefix + ": " + result.length,
        orders: result
      });
    })
    .catch(err => res.status(401).json(err));
};

function getDate(prefix) {
  const jsDate = new Date();
  let opts = {};
  const day = jsDate.getDate() === 1 ? 1 : jsDate.getDate() - jsDate.getDay();

  if (prefix === "week") {
    opts.$gte = new Date(
      jsDate.getFullYear() + "-" + (jsDate.getMonth() + 1) + "-" + day
    );
  } else if (prefix === "day") {
    opts.$gte = new Date(
      jsDate.getFullYear() +
      "-" +
      (jsDate.getMonth() + 1) +
      "-" +
      jsDate.getDate()
    );
  }

  return opts;
}

exports.filter_full_date = (req, res) => {
  const date = new Date(req.params.date);
  const dateMin =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const dateMax =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    (date.getDate() + 1);
  Order.find({ createdAt: { $gte: dateMin, $lt: dateMax } })
    .populate("Order.itemSchema")
    .exec()
    .then(result => {
      res.status(200).json({
        count: result.length,
        orders: result
      });
    })
    .catch(err => res.status(401).json(err));
};

// Get active orders of a user
exports.my_orders = (req, res) => {
  const ph = req.params.phoneNo;
  User.find({ phone: ph })
    .populate({
      path: "orders",
      match: { active: true }
    })
    .exec()
    .then(result => {
      res.status(200).json({
        count: result[0].orders.length,
        result: result[0].orders
      });
    })
    .catch(err => res.status(500).json(err));
};
