const express = require('express');
const router = express.Router();
const Order = require('../models/order')

// Controller reference
const OrdersController = require('../controllers/order')

// Middleware references
const userIsAuth = require('../middleware/users_middleware')
const adminIsAuth = require('../middleware/admin_middleware')
const driverIsAuth = require('../middleware/drivers_middleware')

// Get orders by driver ID
router.get('/getOrdersByDriverID/:driverId', adminIsAuth, OrdersController.get_driver_by_id) //

// Get active orders
router.get('/getActiveOrders', adminIsAuth, OrdersController.get_active_orders); //

// Get archived orders
router.get('/getArchivedOrders', adminIsAuth, OrdersController.get_archived_orders); //

// Get prepared orders
router.get('/getPrepOrders', driverIsAuth, OrdersController.get_prep_orders); //

// Get inMaking orders
router.get('/listInMakingOrders', adminIsAuth, OrdersController.get_inmaking_orders); //

// Add Order
router.post('/makeOrder', userIsAuth, OrdersController.make_order); //

// Take an order
router.put('/takeAnOrder/:orderId', driverIsAuth, OrdersController.take_an_order) //

// Archive order
router.patch('/archiveOrder/:orderId', driverIsAuth, OrdersController.archive_order) //

router.patch('/inMaking/:orderId', adminIsAuth, OrdersController.inmaking) //

router.get('/filter/:prefix', adminIsAuth, OrdersController.filter) //

router.get('/filterFullDate/:date', adminIsAuth, OrdersController.filter_full_date)

module.exports = router;