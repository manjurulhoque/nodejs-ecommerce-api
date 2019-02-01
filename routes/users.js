const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secretKey;
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../utils/validation/register');
const validateLoginInput = require('../utils/validation/login');

// Load user model
const User = require('../models/User');

// user register
router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',// size
                    r: 'pg', // rating
                    d: 'mm' // default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
});

// user login
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                errors.email = 'User email not found!';
                return res.status(404).json(errors);
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //res.json({msg: 'Success'})

                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        // sign token
                        jwt.sign(payload, secret, {expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                    } else {
                        errors.password = 'Password is incorrect';
                        return res.status(400).json(errors);
                    }
                })
        })
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    req.logout();
    return res.status(200).json({
        success: 'true',
        message: 'Logged Out'
    })
});

module.exports = router;