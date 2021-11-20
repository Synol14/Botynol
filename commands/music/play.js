const { Client, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const { embedReply, getEmbed } = require("../../structures/Utils");
const ytdl = require('ytdl-core-discord');
const ytsr = require('youtube-search');
const ytpl = require('ytpl');
const { sendQueuedEmbed, playVideo, sendNowPlayingEmbed } = require("../../structures/MusicUtils");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports.info = {
    name: 'play',
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
    if (!voiceChannel) return embedReply(interaction, getEmbed("🔊 You are not in voice channel !", process.env.RED), false, true);
    const music = await client.servers.get(voiceChannel.guild.id);

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    /// Get Url and Platform
    const query = options.getString('query');
    const platform = options.getString('platform');

    /// Clean Up Url
    const badURL = 'https://youtu.be/';
    if (query.startsWith(badURL)) query = 'https://www.youtube.com/watch?v=' + query.slice(badURL.length);
    
    /* Playlist */
    if (ytpl.validateID(query)) {
        ytpl(query).then((result) => {

            /// Add all videos of playlist in queue
            result.items.forEach((video) => {
                music.queue.push({
                    title: video.title,
                    url: video.shortUrl,
                    imageUrl: video.bestThumbnail.url,
                    commandAuthor: {
                        name: interaction.member.displayName(),
                        avatar: interaction.member.displayAvatarURL()
                    },
                    looping: false
                })
            })
            /// Send embed for playlist queued
            sendQueuedEmbed(interaction, result);

            /// If no current video, start playlist
            if (music.currentVideo.url == '') {
                music.currentVideo = music.queue[0];
                sendNowPlayingEmbed(interaction);
                playVideo(interaction, connection);
            }
        })
        .catch((err) => {
            if (err.message.startsWith('API-Error: The playlist does not exist.')) embedReply(interaction, getEmbed('☹ This playlist does not exist !', process.env.RED), false, true);
            console.error(err);
        });
    }

    /* Video */
    else {
        ytsr(query, { key: process.env.API_KEY, maxResults: 1, type: 'video' }).then(async (result) => {

            if (result.results[0]) {
                /// Set Video Object
                const foundVideo = {
                    title: result.results[0].title,
                    url: result.results[0].link,
                    imageUrl: result.results[0].thumbnails.medium.url,
                    commandAuthor: {
                        name: interaction.user.username,
                        avatar: interaction.user.displayAvatarURL()
                    },
                    looping: false
                };

                /// Send Queue Embed
                sendQueuedEmbed(interaction, foundVideo);

                /// If a video is currently playing, add found video only in queue and quit
                if (music.currentVideo.url != '') return music.queue.push(foundVideo);

                /// Else Finish Quild Object
                music.currentVideo = foundVideo;

                /// Start Video
                sendNowPlayingEmbed(interaction);
                await playVideo(interaction, connection);
            }
            else embedReply(interaction, getEmbed('Song not found ! Sorry ☹ !', process.env.RED), false, true);
        })
        .catch(console.error);
    }

    //embedReply(interaction, getEmbed('Song not found ! Sorry ☹ !', process.env.RED), false, true);
}