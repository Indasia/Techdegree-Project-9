const express = require("express");
const router = require.Router();
const User = require("../models").User;
const Course = require("../models").Course;
const authentication = ("./authentication");


// GET - returns list of courses, including the user that owns each course
router.get('/', function (req, res, next) => {

    // get all the courses
    Course.findAll({
        // specific fields
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
        ],
        // include User info
        include: [
            {
                model: User,
                // send required attributes
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "emailAddress"
                ]
            }
        ]
    }).then(courses => {
        // courses list in response
        res.json(courses);
        // set status code to 200
        res.status(200);
    //catch error
    }).catch(error => {
        error.status = 400;
        next(error);
    });
    
});

// GET - returns the course, including the user that owns the course, for the provided course ID
router.get('/:id', function (req, res, next) => {

    const info = req.params;
    // find specific course
    Course.findOne({
        where: {
            id: info.id;
        }
        // specific fields
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
        ],
        // include User info
        include: [
            {
                model: User,
                // send required attributes
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "emailAddress"
                ]
            }
        ]
    }).then(course => {
        if (course) {
            // course list in response
            res.json(course);
            // set status to 200
            res.status(200);
        } else {
            // send an error
            const error = new Error("We couldn't find a course using this id");
            error.status = 400;
            next(error);
        }
    });
});

// POST - cretes a course, sets the location header to the URI, returns no content


// PUT - updates a course and returns no content


// DELETE - deletes a course and returns no content




module.exports = router;