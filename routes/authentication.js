'use strict';

const auth = require('basic-auth');
const bycrptjs = require('bcryptjs');
const User = ('../models').User;

module.exports = (req, res, next) => {
    // placeholder for errors
    let message = null;
    // credentials from Auth header
    const userCredentials = auth(req);
    // if credentials exist
    if (userCredentials) {
        // find user with matching email address
        User.findOne({
            where: {
                emailAddress: userCredentials.name
            }
        }).then(user => {
            // if a matching email is found
            if (user) {
                // check password
                const authenticated = bycrptjs.compareSync(
                    userCredentials.pass,
                    user.password
                );
                // if the password matches
                if (authenticated) {
                    // store user in request
                    req.currentUser = user;
                    // then go to next middleware
                    next();
                } else {
                    // set status
                    res.status(401);
                    // if password is invalid
                    message = "This password is invalid";
                    // show message
                    res.json({
                        message: message
                    });

                }
            } else {
                // set status
                res.status(401);
                // if we cant find email address
                message = "Unable to find this email address";
                // show message
                res.json({
                    message: message
                });
            }
        });

    } else {
        // set status
        res.status(401);
        // if credentials are missing
        message = "Please enter your login information";
        // show message
        res.json({
            message: message
        });
    }
};