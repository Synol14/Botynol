const { Client, CommandInteractionOptionResolver, MessageEmbed, CommandInteraction } = require("discord.js")
const { getBotColor } = require("../../structures/Utils");
require('dotenv').config()

module.exports.info = {
    name: 'ping',
    defer: false,
    ephemeral: false
}

/**
 * Callback Method for Slash Command Interaction
 * @param {Client} client Bot Client
 * @param {CommandInteraction} interaction Application Command Interaction
 * @param {CommandInteractionOptionResolver} options Application Command Options
 */
module.exports.callback = async (client, interaction, options) => {
    await interaction.reply({ embeds: [ new MessageEmbed().setColor(process.env.DEFAULT_COLOR).setTitle('Pinging...') ], ephemeral: this.info.ephemeral });
    if (process.env.OWNER_ID) var ownerMsg = `Owner : <@${process.env.OWNER_ID}>`;
    else var ownerMsg = "";

    const embed = new MessageEmbed()
        .setColor(getBotColor(client, interaction.guildId))
        .setTitle(":ping_pong:  Pong !")
        .setDescription(ownerMsg + `
            Message sending - \`${Date.now() - interaction.createdTimestamp} ms\`
            Gateway / Websocket - \`${client.ws.ping} ms\`
            NodeJs Version - \`${process.version}\`
            CPU Usage - \`${Math.round(getCPUUsage())} %\`
            Memory Usage - \`${Math.round( (1 - require('os-utils').freememPercentage()) * 100 )} %\`
            Bot OS - \`${require('os').version()}\`
        `);
    interaction.editReply({ embeds: [ embed.toJSON() ], ephemeral: require('./ping').info.ephemeral});
}

function getCPUUsage() {
    // Take the first CPU, considering every CPUs have the same specs
    // and every NodeJS process only uses one at a time.
    const cpus = require('os').cpus();
    const cpu = cpus[0]

    // Accumulate every CPU times values
    const total = Object.values(cpu.times).reduce(
        (acc, tv) => acc + tv, 0
    );

    // Normalize the one returned by process.cpuUsage() 
    // (microseconds VS miliseconds)
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system);

    // Find out the percentage used for this specific CPU
    return currentCPUUsage / total * 100;
}