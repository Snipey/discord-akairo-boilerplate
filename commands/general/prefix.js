const { Command } = require('discord-akairo');

class PrefixCommand extends Command {
	constructor() {
		super('prefix', {
			aliases: ['prefix'],
			category: 'general',
			args: [
				{
					id: 'prefix',
					default: ';',
				},
			],
			channelRestriction: 'guild',
		});
	}

	exec(message, args) {
		// The third param is the default.
		const oldPrefix = this.client.settings.get(message.guild.id, 'prefix', 's!');
		return this.client.settings.set(message.guild.id, 'prefix', args.prefix).then(() => {
			return message.reply(`Prefix changed from ${oldPrefix} to ${args.prefix}`);
		});
	}
}

module.exports = PrefixCommand;