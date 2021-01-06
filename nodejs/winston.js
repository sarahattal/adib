var appRoot = require('app-root-path');
var winston = require('winston');
// var {ElasticsearchTransport} = require('winston-elasticsearch');

var options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    esTransportOpts: {
      level: 'info',
    //   clientOpts: {
    //    // node :'http://localhost:9200'
      node :'http://15.188.87.136:9200'
    //   }
    }
  };


  var logger = new winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
   //   new ElasticsearchTransport(options.esTransportOpts)
     
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
logger.on('error', (error) =>{
  console.error('error caught',error)
})

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };


  module.exports = logger;