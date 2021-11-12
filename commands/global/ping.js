const { Client, Interaction, CommandInteractionOptionResolver, MessageEmbed } = require("discord.js")

module.exports.info = {
    name: 'ping',
    defer: false,
    ephemeral: true
}

/**
 * Callback Method for Slash Command Interaction
 * @param {Client} client Bot Client
 * @param {Interaction} interaction Application Command Interaction
 * @param {CommandInteractionOptionResolver} options Application Command Options
 */
module.exports.callback = async (client, interaction, options) => {
    await interaction.reply({ content: 'Pong !', ephemeral: this.info.ephemeral });
}