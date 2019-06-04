const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Product = require('../models/product')


const userIsAuth = require('../middleware/users_middleware')
const adminIsAuth = require('../middleware/admin_middleware')

// Get all products
router.get('/listProducts', userIsAuth, (req, res, next) => {
  Product
    .find()
    .select('_id name desc price img')
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        products: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.get('/adminListProducts', adminIsAuth, (req, res, next) => {
  Product
    .find()
    .select('_id name desc price img')
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        products: data
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

//get Product with id
router.get('/singleProduct/:productId', userIsAuth, (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .exec()
    .then(data => {
      console.log(data)
      if(data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(
          {
            message: "No valid entry was found for provided ID!"
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.get('/adminSingleProduct/:productId', adminIsAuth, (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .exec()
    .then(data => {
      console.log(data)
      if(data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(
          {
            message: "No valid entry was found for provided ID!"
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})


// Add Product
router.post('/addProduct', adminIsAuth, (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    category: req.body.category,
    img: req.body.img,
  })

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: "A product is created",
        createdProduct: result
      })
    })
    .catch(err => console.log(err))
})

// Update Product
router.patch('/updateProduct/:productId', adminIsAuth, (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}

  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Product
    .update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

// Delete Product
router.delete('/deleteProduct/:productId', adminIsAuth, (req, res, next) => {
  const id = req.params.productId

  Product
    .remove( { _id: id } )
    .then(result => {
      res.status(500).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

module.exports = router;