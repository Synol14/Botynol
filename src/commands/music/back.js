const { getVoiceConnection } = require("@discordjs/voice");
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const { SONG_NO_FOUND, NO_QUEUE } = require("../../structures/Embeds");
const { playVideo, sendNowPlayingEmbed, deleteNowPlayingEmbed } = require("../../structures/MusicUtils");
const { resetMusicObject } = require("../../structures/Objects");
const { embedReply, messageReply } = require("../../structures/Utils");

module.exports.info = {
    name: 'back',
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

    const index = options.getInteger('index') - 1;

    /// If Index Option is defined Set Arrays
    if (index > 0) {
        if (music.queue[index]) {
            for (let i = 0; i < index; i++) {
                music.queue.unshift(music.queue[0]);
                music.backQueue.shift();
            }
        }else return embedReply(interaction, SONG_NO_FOUND, false, true);
    }

    /// Set Up 
    deleteNowPlayingEmbed(interaction);
    music.queue.unshift(music.currentVideo);
    const connection = getVoiceConnection(interaction.guildId);

    /// If no queue, Exit Voice Channel
    if (!music.backQueue[0]) {
        resetMusicObject(client, interaction.guildId);
        if (connection) {
            connection.destroy();
            connection.disconnect();
        }
        return embedReply(interaction, NO_QUEUE(client, interaction.guildId), false, true);
    } else {
        if (interaction.member.voice.joinable) connection.rejoin();
        music.currentVideo = music.backQueue[0];
        music.backQueue.shift(); 
        sendNowPlayingEmbed(interaction);
        playVideo(interaction);
    }

    messageReply(interaction, '⏮️­');

}