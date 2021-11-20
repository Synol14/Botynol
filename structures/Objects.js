const { Client } = require("discord.js");

module.exports.music = {
    currentVideo: {
        title: '',
        url: '',
        imageUrl: '',
        commandAuthor: {
            name: '',
            avatar: ''
        },
        looping: false
    },
    message: null,
    queue: [],
    backQueue: [],
    audioPlayer: null
}

/**
 * Reset Music Object of All Guild
 * @param {Client} client Application Client
 */
module.exports.resetAllMusicObject = async (client) => {
    client.guilds.cache.forEach(guild => this.resetMusicObject(client, guild.id));
}

/**
 * Reset Music Object of a Guild
 * @param {Client} client Application Client
 * @param {String} guildId ID's Guild to Reset
 */
 module.exports.resetMusicObject = async function (client, guildId) {
    client.servers.set(guildId, Object.create({
        currentVideo: {
            title: '',
            url: '',
            imageUrl: '',
            commandAuthor: {
                name: '',
                avatar: ''
            },
            looping: false
        },
        message: null,
        queue: [],
        backQueue: [],
        audioPlayer: null
    }));
}