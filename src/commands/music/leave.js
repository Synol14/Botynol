const { getVoiceConnection } = require("@discordjs/voice");
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const { embedReply, getEmbed, getBotColor } = require("../../structures/Utils");

module.exports.info = {
    name: 'leave',
    defer: true,
    ephemeral: false
}

/**
 * Callback Method for Slash Command Interaction
 * @param {Client} client Bot Client
 * @param {CommandInteraction} interaction Application Command Interaction
 * @param {CommandInteractionOptionResolver} options Application Command Options
 */
module.exports.callback = async (client, interaction, options) => {
    const voiceChannel = client.channels.cache.find(c => c.id == interaction.member.voice.channelId);
    if (!voiceChannel) return embedReply(interaction, USER_NO_IN_CHANNEL, false, true);
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) return embedReply(interaction, NO_VOICE_CHANNEL, false, true);

    connection.disconnect();

    embedReply(interaction, getEmbed(`👋 I quit ${voiceChannel.name}`, getBotColor(client, interaction.guildId)), false, true);
}