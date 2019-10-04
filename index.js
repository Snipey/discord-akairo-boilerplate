const path = require('path');
const SporkClient = require(path.join(__dirname + '/client/SporkClient'));
require('dotenv').config();
const client = new SporkClient({ owner: process.env.OWNERS, token: process.env.DISCORD_TOKEN });
const Sentry = require('@sentry/node');

// Load Logger
if (process.env.SENTRY_URL) {
	try {
		client.logger.log('Sentry Monitoring Loading...');
		Sentry.init({ dsn: process.env.SENTRY_URL, environment: process.env.NODE_ENV });
		client.logger.info('Sentry Monitoring Loaded and Ready!');
	}
	catch (e) {
		client.logger.error(e);
	}
}

client.on('disconnect', () => client.logger.warn('Connection lost...'))
	.on('reconnect', () => client.logger.info('Attempting to reconnect...'))
	.on('error', err => client.logger.error(err))
	.on('warn', info => client.logger.warn(info));
client.start();

process.on('unhandledRejection', err => {
	client.logger.error('An unhandled promise rejection occured');
	client.logger.stacktrace(err);
});