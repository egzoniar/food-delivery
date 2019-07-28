const express = require('express')
const router = express.Router();

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './images/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

// Controller reference
const ProductController = require('../controllers/product')

// Middleware references
const userIsAuth = require('../middleware/users_middleware')
const adminIsAuth = require('../middleware/admin_middleware')

// Get all products (User request)
router.get('/userGetProducts', ProductController.user_get_products) //

router.get('/getProductsByCategory/:category', ProductController.get_products_by_category)

// Get all product (Admin request)
router.get('/adminGetProducts', adminIsAuth, ProductController.admin_get_products) //

// Get single product (User request)
router.get('/userSingleProduct/:productId', userIsAuth, ProductController.user_get_single_product) //

// Get single product (Admin request)
router.get('/adminSingleProduct/:productId', adminIsAuth, ProductController.admin_get_single_product) //

// Add Product
router.post('/addProduct', upload.single('image'), ProductController.add_product) //

// Update Product
router.patch('/updateProduct/:productId', adminIsAuth, ProductController.update_product) //

// Delete Product
router.delete('/deleteProduct/:productId', adminIsAuth, ProductController.delete_product) //
 
module.exports = router;