const express = require("express");
const router = express.Router();
const User = require("../models").User;
const authentication = require("./authentication");
const bcryptjs = require('bcryptjs');


// GET - returns the currently authenticated user
router.get('/', authentication, function (req, res) {
    res.json({
        id: req.currentUser.id,
        firstName: req.currentUser.emailAddress,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    });
    // set status
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
        User.findOne({
            where: { emailAddress: info.emailAddress }
        }).then(user => {
                if (user) {
                    const error = new Error('It looks like this user already exists');
                    error.status = 400;
                    next(error);
                } else {
                    const newUser = {
                        firstName: info.firstName,
                        lastName: info.lastName,
                        emailAddress: info.emailAddress,
                        password: info.password
                    };
                    newUser.password = bcryptjs.hashSync(newUser.password);
                    User.create(newUser)
                        .then(() => {
                            res.location('/');
                            res.status(201).end();
                        }).catch(error => {
                            error.status = 400;
                            next(error);
                        });
                }
            }).catch(error => {
                error.status = 400;
                next(error);
            });
    }
});



module.exports = router;