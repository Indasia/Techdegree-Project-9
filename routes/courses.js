const express = require("express");
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;
const authentication = ("./authentication");


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
        res.json(courses);
        // set status code to 200
        res.status(200);
    //catch error
    }).catch(error => {
        // Send validation error(s) with a400 status code to the user
        error.status = 400;
        // pass any Sequelize validation errors to the global error handler
        next(error);
    });
    
});

// GET - returns the course, including the user that owns the course, for the provided course ID
router.get('/:id', function (req, res, next) {

    const info = req.params;
    // find specific course
    Course.findOne({
        where: {
            id: info.id
        },
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
    if (!info.title) {
        const error = new Error("Please enter a title for your course");
        // Send validation error(s) with a400 status code to the user
        error.status = 400;
        // pass any Sequelize validation errors to the global error handler
        next(error);
    } else {
        // find if a course already exists
        Course.findOne({
            where: {
                title: info.title
            }
        }).then(title => {
            // if course exists
            if (title) {
                const error = new Error("It looks like this course already exists");
                // Send validation error(s) with a400 status code to the user
                error.status = 400;
                // pass any Sequelize validation errors to the global error handler
                next(error);
            } else {
                info.userId = req.currentUser.id;
                Course.create(info).then(course => {
                    console.log("Your course has been created");
                    res.location('/api/courses' + course.id);
                    res.status(200).end();
                }).catch(error => {
                    // handle errors
                    if (error.name === "SequelizeValidationError") {
                        error.message = "All required fields must be filled";
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
                })
            }
        })
    }
});

// PUT - updates a course and returns no content
router.put('/:id', authentication, function () {

    const info = req.body;

    // filter courses by ID
    Course.findOne({
        where: {
            id: info.id
        }
    }).then(course => {
        // if user and course arent connected
        if (course.userId !== req.currentUser.id) {
            // error
            const error = ("You are only allowed to edit your own course");
            error.status = 400;
            next(error);
        } else if (course) {
            // update course info
            course.update(info);
        } else {
            // error
            const error = ("This Course ID could not be found");
            error.status = 400;
            next(error);
        }
    }).then(() => {
        // when successful
        console.log("Your course has been successfully edited");
        res.status(204).end();
    }).catch(error => {
        if (error.name === "SequelizeValidationError") {
            error.message = "All information must be entered";
            error.status = 400;
            next(error);
        } else {
            // error
            error.status = 400;
            next(error);
        }
    })
});

// DELETE - deletes a course and returns no content
router.delete('/:id', authentication, function () {

    const info = req.body;

    // filter courses by ID
    Course.findOne({
        where: {
            id: info.id
        }
    }).then(course => {
        // if user and course arent connected
        if (course.userId !== req.currentUser.id) {
            // error
            const error = ("You are only allowed to delete your own course");
            error.status = 403;
            next(error);
        } else if (course) {
            // delete course
            course.destroy();
            console.log("Your course has been deleted");
            res.status(204).end();
        } else {
            // error
            const error = ("This Course ID could not be found");
            error.status = 400;
            next(error);
        }
    }).catch(error => {
        if (error.name === "SequelizeValidationError") {
            error.message = "All information must be entered";
            error.status = 400;
            next(error);
        } else {
            // error
            error.status = 400;
            next(error);
        }
    })
});



module.exports = router;