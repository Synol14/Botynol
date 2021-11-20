const { VoiceConnection, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const { resetMusicObject } = require("./Objects");
const { embedReply, getBotColor } = require("./Utils");
const ytdl = require('ytdl-core-discord');
const ytsr = require('youtube-search');
const ytpl = require('ytpl');

module.exports.YOUTUBE_THUMBNAIL = "https://i1.wp.com/www.grapheine.com/wp-content/uploads/2017/08/youtube-logo.gif?quality=90&strip=all&ssl=1";

/**
 * Play a Video in Voice Channel
 * @param {CommandInteraction} interaction Application Command Interaction
 * @param {VoiceConnection} connection Bot Voice Connection 
 * @param {Boolean} next If is next command
 * @param {Boolean} looping If is lopping command
 */
module.exports.playVideo = async (interaction, next = false, looping = false) => {
    /// Get Guild Object and Voice Connection
    const music = interaction.client.servers.get(interaction.guildId);
    const connection = getVoiceConnection(interaction.guildId)

    /// Play Video from Url of Current Video without video (only sound)
    const stream = await ytdl(music.currentVideo.url, { filter: 'audioonly' });
    const player = createAudioPlayer();
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    //if (next) music.queue.shift();              // Set Queue or 
    //else if (!looping) music.backQueue.shift(); //     Backqueue
    music.audioPlayer = player;

    /// Finish Event
    player.once(AudioPlayerStatus.Idle, (oldOne, newOne) => {
        /// If message exist, delete it
        if (music.message) this.deleteNowPlayingEmbed(interaction);

        /*/// Lopping Current Video
        if (music.currentVideo.looping) {
            this.sendNowPlayigEmbed(interaction);
            return this.playVideo(interaction, false, true); /// Recursive Function
        }//*/

        /// Add Current Video in backqueue
        //music.backQueue.unshift(music.currentVideo);

        /// If Queue isn't empty, Start Next Video
        if (music.queue[0]) {
            music.currentVideo = music.queue[0];
            music.queue.shift();
            this.sendNowPlayingEmbed(interaction);
            return this.playVideo(interaction); /// Recursive Function
        }

        /// Leave Channel and Reset Music Object
        resetMusicObject(interaction.client, interaction.guildId);
        connection.destroy();
        //connection.disconnect();
    });
}

/**
 * Send Now Paying Embed
 * @param {CommandInteraction} interaction Application Command Interaction
 */
module.exports.sendNowPlayingEmbed = async (interaction) => {
    const music = interaction.client.servers.get(interaction.guildId);
    interaction.channel.send({ embeds: [ new MessageEmbed()
            .setColor(getBotColor(interaction.client))
            .setTitle('Now Playing :')
            .setDescription(`[${music.currentVideo.title}](${music.currentVideo.url})`)
            .setAuthor(music.currentVideo.commandAuthor.name, music.currentVideo.commandAuthor.avatar, music.currentVideo.commandAuthor.avatar)
            .setImage(music.currentVideo.imageUrl)
            .setThumbnail(this.YOUTUBE_THUMBNAIL)
            .toJSON() 
        ] })
        .then(msg => music.message = msg);
}

/**
 * Send Queue Embed
 * @param {CommandInteraction} interaction Application Command Interaction
 * @param {Object} result Video Found Object
 */
module.exports.sendQueuedEmbed = async (interaction, result) => {
    const music = interaction.client.servers.get(interaction.guildId);
    embedReply(interaction, 
        new MessageEmbed()
            .setColor(getBotColor(interaction.client))
            .setDescription(`Queued [${result.title}](${result.url})`)
    );
}

/**
 * Delete Now Playing Embed
 * @param {CommandInteraction} interaction Application Command Interaction
 */
module.exports.deleteNowPlayingEmbed = async (interaction) => {
    interaction.client.servers.get(interaction.guildId).message.delete();
}