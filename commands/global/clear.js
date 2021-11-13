const { Client, Interaction, CommandInteractionOptionResolver } = require("discord.js")

module.exports.info = {
    name: 'clear',
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
    if (interaction.member.permissions.has('MANAGE_MESSAGES')) return ephemeralEmbedReply(interaction, getEmbed("You don't have permission !", process.env.RED));
}