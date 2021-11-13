const { Client, MessageEmbed, User, Channel, Interaction, CommandInteraction } = require("discord.js");
const { readdirSync } = require("fs");

/**
 * Get an Embed with a Title and the Default Color
 * @param {String} string Embed Title
 * @return {MessageEmbed} Embed
 */
 module.exports.getEmbed = async (string) => {
    return getEmbed(process.env.DEFAULT_COLOR, string);
}

/**
 * Get an Embed with a Title and a Color
 * @param {String} color Embed Color (Hex)
 * @param {String} string Embed Title
 * @return {MessageEmbed} Embed
 */
 module.exports.getEmbed = async (color, string) => {
    return new MessageEmbed().setColor(color).setTitle(string);
}

/**
 * Get User Avatar Url
 * @param {User} user 
 */
 module.exports.getAvatarUrl = (user) => {
    if (user.avatar) return user.avatar;
    else return user.defaultAvatarURL;
}

/**
 * Send Message and delete it after default time
 * @param {Channel} channel channel where send message
 * @param {Object} message message to send
 */
module.exports.sendMessageForDelete = async (channel, message) => {
    channel.send(message).then(msg => setTimeout(() => msg.delete(), process.env.DEFAULT_TIME));
}

/**
 * Send Message and delete it after a time
 * @param {Channel} channel channel where send message
 * @param {Object} message message to send
 * @param {Integer} time deletion time (ms)
 */
module.exports.sendMessageForDelete = async (channel, message, time) => {
    channel.send(message).then(msg => setTimeout(() => msg.delete(), time));
}

/**
 * Reply to a Interaction with Ephemerel Option enabled
 * @param {Interaction} interaction Application Command Interaction
 * @param {Object} msg Object to reply
 */
module.exports.ephemeralReply = async (interaction, msg) => {
    if (typeof msg == MessageEmbed) await this.ephemeralEmbedReply(interaction, msg);
    else if (typeof msg == String) await this.ephemeralMessageReply(interaction, msg);
}

/**
 * Reply a message to a Interaction with Ephemerel Option enabled
 * @param {Interaction} interaction Application Command Interaction
 * @param {String} message Message to send
 */
module.exports.ephemeralMessageReply = async (interaction, message) => {
    if (interaction.deferred) await interaction.editReply({ content: message, ephemeral: true});
    else await interaction.reply({ content: message, ephemeral: true});
}

/**
 * Reply a Embed to a Interaction with Ephemerel Option enabled
 * @param {CommandInteraction} interaction Application Command Interaction
 * @param {MessageEmbed} embed Embed to send
 */
 module.exports.ephemeralEmbedReply = async (interaction, embed) => {
    if (interaction.replied) await interaction.editReply({ embeds: [ embed.toJSON() ], ephemeral: true});
    else await interaction.reply({ embeds: [ embed.toJSON() ], ephemeral: true});
}

/**
 * Load all Command Files from a Directory
 * @param {Client} client Bot Client
 * @param {String} dir Commands Directory
 */
module.exports.loadCommands = (client, dir = `${__dirname}/commands/`) => {
    client.commands.clear();
    client.commandsGroups = [];
    readdirSync(dir).forEach(dirs => {
        client.commandsGroups.push(dirs.toString())
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));
        for (const file of commands) {
            const getFile = require(`${dir}/${dirs}/${file}`);
            client.commands.set(getFile.info.name.toLowerCase(), getFile)
            console.log(`Commands loaded: ${getFile.info.name}`);
        }
    });
}

/**
 * Load all Event File in Path
 * @param {Client} client Bot Client
 * @param {String} dir Directory Path
 */
module.exports.loadEvents = (client, dir = `${__dirname}/events/`) => {
    readdirSync(dir).forEach(dirs => {
        const eventFiles = readdirSync(`${dir}/${dirs}/`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            console.log(file);
            const event = require(`${dir}/${dirs}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    });
}