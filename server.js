// Complete Ecommerce Application
const express = require('express');
const app = express();
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors()); // enabling all cors
// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Connection, Access-Control-Request-Method, Access-Control-Request-Headers");
//     next();
// });

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// connect to mongodb
mongoose.connect('mongodb://localhost/my_ecommerce', { useNewUrlParser: true})
        .then(() => console.log('DB Connected'))
        .catch(err => console.log(err));

// add body-parser and cookie parser middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// routes
const users = require('./routes/users');
const categories = require('./routes/categories');
const products = require('./routes/products');

// register routes
app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/products', products);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Server running on port: ' + port);
});