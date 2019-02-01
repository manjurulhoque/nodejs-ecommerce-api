const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = Category = mongoose.model('categories', CategorySchema);