// Complete Ecommerce Application
const express = require('express');
const app = express();
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// connect to mongodb
mongoose.connect('mongodb://localhost/my_ecommerce', { useNewUrlParser: true})
        .then(() => console.log('DB Connected'))
        .catch(err => console.log(err));

// add body-parser and cookie parser middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Server running');
})