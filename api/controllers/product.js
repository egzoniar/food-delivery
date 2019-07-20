const mongoose = require('mongoose');
const Product = require('../models/product')


// Get all products (User)
exports.user_get_products = (req, res, next) => {
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
}

exports.get_products_by_category = (req, res, next) => {
  const category = req.params.category

  Product.find({ category: category })
    .exec()
    .then(product => {
      const response = {
        count: product.length,
        products: product
      }
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}


// Get all products (Admin)
exports.admin_get_products = (req, res, next) => {
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
}


// Get single product (User)
exports.user_get_single_product = (req, res, next) => {
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
}


// Get single product (Admin)
exports.admin_get_single_product = (req, res, next) => {
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
}


// Add product
exports.add_product = (req, res, next) => {
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
}


// Update product
exports.update_product = (req, res, next) => {
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
}


// Delete product
exports.delete_product = (req, res, next) => {
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
}