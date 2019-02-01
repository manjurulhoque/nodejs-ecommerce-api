const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

// Load Validation
const validateProductInput = require('../utils/validation/product');

// Load Model
const Product = require('../models/Product');

// create product
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateProductInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newProduct = new Product(req.body);

    newProduct.save()
            .then(product => {
                return res.json(product);
            })
            .catch(err => console.log(err));
});

// get all products
router.get('/', (req, res) => {
    Product.find({})
            .populate('category')
            .limit(100)
            .exec((err, products) => {
                if(err) return res.status(400).send(err);

                return res.json(products);
            })
})

// get product by id
router.get('/:product_id', (req, res) => {
    const errors = {};
    // Product
    Product.findOne({_id: req.params.product_id})
        .populate('category')
        .then(product => {
            if (!product) {
                errors.noproduct = 'There is no product with this Id'
                return res.status(404).json(errors);
            }

            res.json(product);
        })
        .catch(err => {return res.status(404).json(err)});
});

// products by category
router.get('/:category_id/category', (req, res) => {
    const errors = {};
    // Product
    Product.find({"category": req.params.category_id})
        .then((products) => {
            if (!products) {
                errors.noproduct = 'There is no product with this category'
                return res.status(404).json(errors);
            }

            res.json(products);
        })
        .catch(err => {return res.status(404).json(err)});
});

module.exports = router;