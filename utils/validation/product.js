const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateProductInput = (data, files) => {
    let errors = {};

    if(files.length == 0) {
        errors.images = "Upload at least one image for product";
    }

    data.name = !isEmpty(data.name) ? data.name : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.price = !isEmpty(data.price) ? data.price : '';
    data.category = !isEmpty(data.category) ? data.category : '';
    data.shipping = !isEmpty(data.shipping) ? data.shipping : '';
    data.available = !isEmpty(data.available) ? data.available : '';

    if (!Validator.isLength(data.name, {min: 2, max: 100})) {
        errors.name = 'Category name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Category name field is required';
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (!Validator.isLength(data.description, { min:2, max: 100000})) {
        errors.description = 'Description field must be between 2 and 100000 words';
    }

    if (Validator.isEmpty(data.price)) {
        errors.price = 'Price field is required';
    }

    if (!Validator.isLength(data.price, { min: 1, max: 255})) {
        errors.price = 'Price field must be maximum 255';
    }

    if (Validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    if (!Validator.isMongoId(data.category)) {
        errors.category = 'Category field must be a valid Id';
    }

    if (Validator.isEmpty(data.shipping)) {
        errors.shipping = 'Shipping field is required';
    }

    if (Validator.isEmpty(data.available)) {
        errors.available = 'Available field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}