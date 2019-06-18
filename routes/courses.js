const express = require("express");
const router = require.Router();
const User = require("../models").User;
const Course = require("../models").Course;


// GET - returns list of courses, including the user that owns each course


// GET - returns the course, including the user that owns the course, for the provided course ID


// POST - cretes a course, sets the location header to the URI, returns no content


// PUT - updates a course and returns no content


// DELETE - deletes a course and returns no content




module.exports = router;