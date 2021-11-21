const { getVoiceConnection } = require("@discordjs/voice");
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const { USER_NO_IN_CHANNEL } = require("../../structures/Embeds");
const { deleteNowPlayingEmbed } = require("../../structures/MusicUtils");
const { resetMusicObject } = require("../../structures/Objects");
const { embedReply, messageReply } = require("../../structures/Utils");

module.exports.info = {
    name: 'stop',
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
    const music = await client.servers.get(voiceChannel.guild.id);
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) return embedReply(interaction, NO_VOICE_CHANNEL, false, true);

    deleteNowPlayingEmbed(interaction);
    resetMusicObject(client, interaction.guildId);
    music.backQueue.unshift(music.currentVideo);

    music.audioPlayer = null;
    connection.destroy();
    connection.disconnect();

    messageReply(interaction, '🛑­');
}