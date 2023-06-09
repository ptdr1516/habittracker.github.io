const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
});

// Registration Page
router.get('/register', (req, res) => {
   res.render('register')
});

// Feature Registration
router.post('/register', (req, res) => {
    const { name, email } = req.body;

    let errors = [];

    if (!name || !email) {
        errors.push({
            msg: 'All fields must be provided'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        });
    }
    else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                // User already exists
                errors.push({
                    msg: 'Email id already exists'
                });
                res.render('register', {
                    errors,
                    name,
                    email
                });
            }
            else {
                const newUser = new User({
                    name, email
                });

                newUser.save().then((user) => {
                    req.flash('successMsg','Your account has been registered');
                    res.redirect('/users/login');
                })
                    .catch((err) => {
                        console.log('Error',err);
                    })

            }
        });
    }
});

// Feature Login
router.post('/login', (req, res) => {
    const { name, email } = req.body;

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            let errors = [];
            errors.push({
                msg: 'Email not found'
            });
            res.render('login', {
                errors,
                name,
                email
            });
        }
        else {
            res.redirect(`/controller?user=${user.email}`);
        }
    });
});

// Feature Logout
router.get('/logout', (req, res) => {
    req.flash('successMsg', 'Logout Successfully');
    res.redirect('/users/login');
})

module.exports = router;