const path = require('path');
const Logger = require('../util/logger.js');
const readdir = require('util').promisify(require('fs').readdir);
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

let db;
if (config.use_env_variable) {
	db = new Sequelize(process.env[config.use_env_variable], config);
}
else {
	db = new Sequelize(config.database, config.username, config.password, config);
}

class Database {
	static get db() {
		return db;
	}

	static async authenticate() {
		try {
			await db.authenticate();
			Logger.info('Connection to database has been established successfully.', { tag: 'Database' });
			await this.loadModels(path.join(__dirname, '..', 'models'));
			Logger.info('Loaded Models successfully.', { tag: 'Database' });
		}
		catch (err) {
			Logger.error('Unable to connect to the database:', { tag: 'Database' });
			Logger.stacktrace(err, { tag: 'Database' });
			Logger.info('Attempting to connect again in 5 seconds...', { tag: 'Database' });
			setTimeout(this.authenticate, 5000);
		}
	}

	static async loadModels(modelsPath) {
		const files = await readdir(modelsPath);

		for (const file of files) {
			const filePath = path.join(modelsPath, file);
			if (!filePath.endsWith('.js')) continue;
			await require(filePath).sync({ alter: true }); // eslint-disable-line no-await-in-loop
		}
	}
}

module.exports = Database;