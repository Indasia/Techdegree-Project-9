const express = require("express");
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;
const authentication = require("./authentication");


// GET - returns list of courses, including the user that owns each course
router.get('/', function (req, res, next) {

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
        res.json({ courses });
        // set status code to 200
        res.status(200);
    //catch error
    }).catch(error => {
        // send validation error(s) with a 400 status code to the user
        error.status = 400;
        // proceed to next middleware
        next(error);
    });
    
});

// GET - returns the course, including the user that owns the course, for the provided course ID
router.get('/:id', function (req, res, next) {
    // info from user
    const info = req.params;
    // find specific course
    Course.findOne({
        where: {id: info.id },
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
        // if course matches
        if (course) {
            // return course
            res.json({ course });
            // set status to 200
            res.status(200);
        } else {
            // send an error
            const error = new Error("We couldn't find this course");
            // Send validation error(s) with a400 status code to the user
            error.status = 400;
            // pass any Sequelize validation errors to the global error handler
            next(error);
        }
    });
});

// POST - creates a course, sets the location header to the URI, returns no content
router.post('/', authentication, function (req, res, next) {
   
    const info = req.body;

    // if title is not entered
    if (!info.title && !info.description) {
        const error = new Error("Please enter a title and description for your course");
        // Send validation error(s) with a 400 status code to the user
        error.status = 400;
        // proceed to next middleware
        next(error);
    } else if (!info.title) {
        const error = new Error('Enter a title');
        error.status = 400;
        next(error);
    } else if (!info.description) {
        const error = new Error('Enter a description');
        error.status = 400;
        next(error);
    } else {
        // check to see if course already exists
        Course.findOne({
            where: { title: info.title }
        }).then(title => {
                // show error if course already exists
                if (title) {
                    const error = new Error('It looks like this course already exists');
                    error.status = 400;
                    next(error);
                } else {
                    // otherwise, create new course
                    Course.create(info)
                        .then(course => {
                            // set location header
                            res.location(`/api/courses/${course.id}`);
                            // set status and return no content
                            res.status(201).end();
                        }).catch(error => {
                            error.status = 400;
                            next(error);
                        });
                }
            })
    }
});

// PUT - updates a course and returns no content
router.put('/:id', authentication, function (req, res, next) {

    const info = req.body;

 // if title and description is not filled out
    if(!info.title && !info.description) {
    const error = new Error('Enter a title and a description');
    error.status = 400;
    next(error);
    } else if (!info.title) {
    const error = new Error('Enter a title.');
    error.status = 400;
    next(error);
    } else if (!info.description) {
    const error = new Error('Enter a description.');
    error.status = 400;
    next(error);
    } else {
    // find a course to update
        Course.findOne({
            where: { id: req.body.id }
        }).then(course => {
            // if course doesnt exist
            if(!course) {
            //Show error
                res.status(404);
                res.json({ message: 'Could not find this course' });
            } else if (course) {
            //Updated course info if course exists
            const updateCourse = {
                id: info.id,
                title: info.title,
                description: info.description,
                estimatedTime: info.estimatedTime,
                materialsNeeded: info.materialsNeeded,
                userId: req.currentUser.id
            };
            course.update(info);
            }
        }).then (() => {
            // set status and end the request
            res.status(204).end();
        }).catch(error => {
            error.status = 400;
            next(error);
        });
    }
});

// DELETE - deletes a course and returns no content
router.delete('/:id', authentication, function (req, res, next) {

    // find a course
    Course.findOne({
        where: { id: req.params.id }
    }).then(course => {
            // if course doesnt exist
            if (!course) {
                res.status(404)
                res.json({ message: 'Could not find this course' });
            } else {
                // delete the course
                return course.destroy();
            }
        }).then(() => {
            // set status and end the request
            res.status(204).end();
        }).catch(error => {
            error.status = 400;
            next(error);
        });
});


module.exports = router;