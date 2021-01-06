/**
 * @module config
 */
fs = require('fs');

module.exports = {

	LISTEN_PORT: process.env.PORT || 3001,
	TOKEN_SECRET: process.env.TOKEN_SECRET || '5749fb86cb741140c2f9b2ab33873d58',
	

	DB_HOST: process.env.DB_HOST || 'dbassist.c5jqpssldtda.us-east-1.rds.amazonaws.com',
	DB_PORT: process.env.DB_PORT || '5432',
	DB_NAME: process.env.DB_NAME || 'bot',
	DB_USER: process.env.DB_USER || 'ubilityai',
	DB_PASSWORD: process.env.DB_PASSWORD || 'ubility#07'
};