'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';
// create the Express app
const app = express();
// create Sequelize instance - code from http://docs.sequelizejs.com/manual/getting-started
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db'
});

// setup morgan which gives us http request logging
app.use(morgan('dev'));
// setup request body json parsing
app.use(express.json());

// setup your api routes here
app.use("/api/index", require("./routes/index")); 
app.use("/api/users", require("./routes/users"));  
app.use("/api/courses", require("./routes/courses")); 
app.use("/api/authentication", require("./routes/authentication"));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// start the server, the port to serve the application on
app.listen(5000, () => {
  // log a string to the console that says which port the app is listening to.
  console.log("Your application is now connected to port 5000!")
});

/* should I use this one?

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

*/

// test a connection
sequelize.authenticate().then(() => {
  console.log('Connection successful!')
});