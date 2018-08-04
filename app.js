'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const mongoose = require('mongoose');
const EventHandler = require('./libs/nats-handler');
const config = require('./config/config')();

module.exports = app; // for testing

// Use native promises
mongoose.Promise = global.Promise;

/**
 * Config with sercurity by api-key
 */
// var config = {
//   appRoot: __dirname, // required config
// 	swaggerSecurityHandlers: {
// 		api_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
// 		  // security code
// 		  if('1234' === scopesOrApiKey) {
// 		    callback(null);
// 		  }
// 		  else {
// 		    // callback(new Error('access denied!'));
// 		    callback({ 
// 		      message: "Error doing something",
// 		      code: "SomeAppCode",
// 		      statusCode: 401,
// 		      headers: []
// 		    });
// 		  }
// 		}
// 	}
// };

config.appRoot = __dirname;

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }
  
  //mongoose
  config.dbURL = process.env.DB_URL || config.dbURL;  
  const db = mongoose.connect(config.dbURL).connection;
  db.on('error', (err) => {
    console.log(`connection error: ${err}`);    
  });

  // Event handler
  const eventHandler = new EventHandler();
  eventHandler.connect();

  /**
   * Use some middleware
   */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'x-access-token');
    res.header('Access-Control-Allow-Headers', 'api_key');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    next();
  });

  // enable SwaggerUI. E.g. http://host:port/docs/
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 3000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(`try this:\ncurl http://127.0.0.1:${port}/hello?name=Scott`);
  }
});
