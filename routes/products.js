const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const _ = require('lodash');

// Load Validation
const validateProductInput = require('../utils/validation/product');

// Load Model
const Product = require('../models/Product');

// SET STORAGE
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // if(!file.originalname.match(/\.(jpeg|jpg|png|JPEG|JPG|PNG)$/)){

        //     var err = new Error();
        //     err.code="filetype";
        //     return cb(err);
        // }else {
        //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // }
    }
});

let validateFile = function(file, cb){
    let allowedFileTypes = /jpeg|jpg|png|JPEG|JPG|PNG/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if(extension && mimeType){
        return cb(null, true);
    }else{
        cb("Invalid file type. Only JPEG, PNG, JPG file are allowed.")
    }
}

let upload = multer(
    { 
        storage: storage,
        limits: { fileSize:200000 },
        fileFilter: function(req, file, callback){
            validateFile(file, callback);
        }
    }
);

// create product
router.post('/create', upload.array('images', 5), passport.authenticate('jwt', { session: false }), (req, res) => {

    // return res.send(_.map(req.files, (image, index) => {return image.path}));

    const { errors, isValid } = validateProductInput(req.body, req.files);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    // // image is requied
    // upload((req, res, err) => {

    // });

    const newProduct = new Product({
        ...req.body,
        images: _.map(req.files, (image, index) => image.path)
    });

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