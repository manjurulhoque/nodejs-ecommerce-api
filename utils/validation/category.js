const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateCategoryInput = data => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Category name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Category name field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}