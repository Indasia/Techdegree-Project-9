'use strict';

const express = require('express');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const User = require("../models").User;


module.exports = (req, res, next) => {
    // holds errors
    let message = null;
    // grab the users credentials from the authorization header
    const userCredentials = auth(req);

    // if users credentials are valid
    if (userCredentials) {
        // find a user with an email address that matches
        User.findOne({
            where: { emailAddress: credentials.name }
        }).then(user => {
                // if the email address matches
                if (user) {
                    // check the password
                    const authenticated = bcryptjs.compareSync(userCredentials.pass, user.password);
                    // if password matches
                    if (authenticated) {
                        // store user in request
                        req.currentUser = user;
                        // proceed to next middleware
                        next();
                    } else {
                        // if password isnt a match
                        message = "That password does not match";
                        // set status code
                        res.status(401);
                        // show message
                        res.json({ message: message });
                    }
                } else {
                    // otherwise if user isnt a match
                    message = "We could not find this user in our system";
                    // set status code
                    res.status(401);
                    // show message
                    res.json({ message: message });
                }
        });
        
        // if there are empty credentials
    } else {
        const error = new Error('You have not entered all required credentials');
        error.status = 401;
        next(error);
    }

};