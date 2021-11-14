const { Interaction } = require("discord.js");
const { ephemeralEmbedReply, getEmbed } = require("../../Utils");

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
            await ephemeralEmbedReply(interaction, getEmbed('Command no Done !', process.env.RED));
            msg = 'FAIL (No Done)';
        }
        else {
            try {
                if (command.info.defer) await interaction.deferReply({ ephemeral: command.info.ephemeral });
                await command.callback(interaction.client, interaction, options);
            } catch (error) {
                console.error(error);
                await ephemeralEmbedReply(interaction, getEmbed('Command Error !', process.env.RED));
                msg = `FAIL ( ${error} )`;
            } finally {
                /// Log Command
                console.log(`[Info]  [App_Cmd - ${id}]  The \'${commandName}\' command has been use with  ${msg}`);
            }
        }
    }
}