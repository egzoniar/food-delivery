const express = require("express");
const router = express.Router();

// Controller reference
const OrdersController = require("../controllers/order");

// Middleware references
const userIsAuth = require("../middleware/users_middleware");
const adminIsAuth = require("../middleware/admin_middleware");
const driverIsAuth = require("../middleware/drivers_middleware");

// Get orders by driver ID
router.get("/getOrdersByDriverID/:driverId", OrdersController.get_driver_by_id); //adminIsAuth(i hekum), Mi shtu te dhenat e userit qe e ka bo porosine (Emri, Mbiemri, Telefoni)

// Get active orders
router.get("/getActiveOrders", OrdersController.get_active_orders); //

// Get archived orders
router.get("/getArchivedOrders", adminIsAuth, OrdersController.get_archived_orders); //

// Get prepared orders
router.get("/getPrepOrders", driverIsAuth, OrdersController.get_prep_orders); //

// Get inMaking = false orders      DUHET MU SHTU NE BACKEND MOS ME HARRU
router.get("/listNotInMakingOrders", OrdersController.get_notinmaking_orders);

// Get inMaking orders
router.get("/listInMakingOrders", OrdersController.get_inmaking_orders);

router.get("/listInMakingOrdersDriver", driverIsAuth, OrdersController.get_inmaking_orders_driver); //

// My orders
router.get("/myOrders/:phoneNo", userIsAuth, OrdersController.my_orders);

// Add Order
router.post("/makeOrder", userIsAuth, OrdersController.make_order); //

// Take an order
router.put("/takeAnOrder/:orderId", driverIsAuth, OrdersController.take_an_order); //

// Drop an order
router.put("/dropAnOrder/:orderId", driverIsAuth, OrdersController.drop_an_order);

// Archive order
router.patch("/archiveOrder/:orderId", driverIsAuth, OrdersController.archive_order); //

router.patch("/inMaking/:orderId", OrdersController.inmaking); //Duhet me ndryshu prej false ne true,  adminIsAuth i hekum

router.patch("/done/:orderId", OrdersController.done); //Duhet me shtu si Route

router.get("/filter/:prefix", adminIsAuth, OrdersController.filter); //

router.get("/filterFullDate/:date", adminIsAuth, OrdersController.filter_full_date);

module.exports = router;
