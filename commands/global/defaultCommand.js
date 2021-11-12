const { Client, Interaction, CommandInteractionOptionResolver } = require("discord.js")

module.exports.info = {
    name: 'defaultCommand',
    defer: true,
    ephemeral: true
}

/**
 * Callback Method for Slash Command Interaction
 * @param {Client} client Bot Client
 * @param {Interaction} interaction Application Command Interaction
 * @param {CommandInteractionOptionResolver} options Application Command Options
 */
module.exports.callback = async (client, interaction, options) => {
    
    /* Some Code */

}