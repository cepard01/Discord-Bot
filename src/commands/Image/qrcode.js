// Dependencies
const	{ MessageEmbed } = require('discord.js'),
	Command = require('../../structures/Command.js');

module.exports = class QRcode extends Command {
	constructor(bot) {
		super(bot, {
			name: 'qrcode',
			dirname: __dirname,
			aliases: ['qr-code'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Create a QR code.',
			usage: 'qrcode <text | file>',
			cooldown: 5000,
			examples: ['qrcode https://www.google.com/', 'qrcode <attachment>'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Get text for QR encoding (including file URl)
		const text = (!message.args[0]) ? message.GetImage(message, message.args, settings.Language)[0] : message.args.join(' ');

		// send 'waiting' message
		const msg = await message.channel.send(bot.translate(settings.Language, 'IMAGE/GENERATING_IMAGE'));

		// Try and convert image
		try {
			// send image in embed
			const embed = new MessageEmbed()
				.setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(new RegExp(' ', 'g'), '%20')}`);
			msg.delete();
			message.channel.send(embed);
		} catch(err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
		}
	}
};
