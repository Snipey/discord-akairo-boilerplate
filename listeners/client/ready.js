const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	async exec() {
	// Log that the bot is online.
		this.client.logger.info(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'ready');
		// Set the bot status
		this.client.user.setActivity('Akiro Boilerplate v1.0.0', { type: 'PLAYING' });
	}
}

module.exports = ReadyListener;