const express = require('express')
const router = express.Router();

// Controller reference
const ProductController = require('../controllers/product')

// Middleware references
const userIsAuth = require('../middleware/users_middleware')
const adminIsAuth = require('../middleware/admin_middleware')

// Get all products (User request)
router.get('/userGetProducts', ProductController.user_get_products) //

// Get all product (Admin request)
router.get('/adminGetProducts', adminIsAuth, ProductController.admin_get_products) //

// Get single product (User request)
router.get('/userSingleProduct/:productId', userIsAuth, ProductController.user_get_single_product) //

// Get single product (Admin request)
router.get('/adminSingleProduct/:productId', adminIsAuth, ProductController.admin_get_single_product) //

// Add Product
router.post('/addProduct', adminIsAuth, ProductController.add_product) //

// Update Product
router.patch('/updateProduct/:productId', adminIsAuth, ProductController.update_product) //

// Delete Product
router.delete('/deleteProduct/:productId', adminIsAuth, ProductController.delete_product) //
 
module.exports = router;