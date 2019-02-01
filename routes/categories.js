const express = require('express');
const router = express.Router();

// Load validation
const validateCategoryInput = require('../utils/validation/category');

// Load Category model
const Category = require('../models/Category');

// create category
router.post('/create', (req, res) =>{
    const {errors, isValid} = validateCategoryInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Category.findOne({name: req.body.name})
            .then(category => {
                if(category){
                    errors.name = 'Name with this category already exists';
                    return res.status(400).json(errors)
                }

                const newCategory = new Category({
                    name: req.body.name
                });

                newCategory.save()
                            .then(category => res.json(category))
                            .catch(err => console.log(err));
            })
});

module.exports = router;