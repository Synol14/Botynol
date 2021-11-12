const { Interaction, MessageEmbed } = require("discord.js");
const { ephemeralReply, ephemeralEmbedReply } = require("../../Utils");

module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * Execute Event
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        /// Quit if not a command
        if (!interaction.isCommand()) return;

        /// Get Data
        const { commandName, options, id } = interaction;

        /// Geting command
        const command = interaction.client.commands.get(commandName);
        
        /// Execute
        let msg = 'SUCCESS'
        if (!command) {
            await ephemeralEmbedReply(interaction, new MessageEmbed().setColor(process.env.RED).setTitle('Command no Done !'));
            msg = 'FAIL (No Done)';
        }
        else {
            try {
                if (command.info.defer) await interaction.deferReply({ ephemeral: command.info.ephemeral });
                await command.callback(interaction.client, interaction, options);
            } catch (error) {
                console.error(error);
                await ephemeralEmbedReply(interaction, new MessageEmbed().setColor(process.env.RED).setTitle('Command Error !'));
                msg = `FAIL ( ${error} )`;
            }
        }

        /// Log Command
        console.log(`[App_Cmd - ${id}] The \'${commandName}\' command has been use with  ${msg}`);
    }
}