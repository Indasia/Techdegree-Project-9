const express = require("express");
const router = require.Router();
const User = require("../models").User;
const authentication = ("./authentication");
const bcrypt = require('bcryptjs');


// GET - returns the currently authenticated user
router.get('/', authentication, function (req, res) {
    res.json({
        id: req.currentUser.id,
        firstName: req.currentUser.emailAddress,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    });
    res.status(200);
});

// POST - creates a user, sets the location header to "/", and returns no content
router.post('/', function (req, res, next) {

    const info = req.body;

    // if email hasn't been entered...
    if (!info.emailAddress) {
        // then create an error and set status
        const error = new Error('You have not entered a valid email address');
        // Send validation error(s) with a400 status code to the user
        error.status = 400;
        // pass any Sequelize validation errors to the global error handler
        next(error);
        // otherwise...
    } else {
        User.findOne({ where: { emailAddress: info.emailAddress } })
            .then(email => {
            // if email address already exists...
            if (email) {
                const error = new Error('This email address is already in use');
                // Send validation error(s) with a400 status code to the user
                error.status = 400;
                // pass any Sequelize validation errors to the global error handler
                next(error);
                // if email is valid...
            } else {
                // hash password using bcryptjs npm package before persisting user to the database
                info.password = bcrypt.hashSync(info.password);
                // create a user
                User.create(info)
                    .then(() => {
                        res.location('/');
                        res.status(201).end();
                        // catch error and check if Sequelize validation error
                    }).catch(error => {
                        if (error.name === "SequelizeValidationError") {
                            error.message = "All information must be entered";
                            // Send validation error(s) with a400 status code to the user
                            error.status = 400;
                            // pass any Sequelize validation errors to the global error handler
                            next(error);
                        } else {
                            // Send validation error(s) with a400 status code to the user
                            error.status = 400;
                            // pass any Sequelize validation errors to the global error handler
                            next(error);
                        }

                    });
            }
        });
    }
});



module.exports = router;