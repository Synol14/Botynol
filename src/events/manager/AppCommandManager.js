const { Interaction } = require("discord.js");
const { Logger } = require("../../structures/Logger");
const { getEmbed, embedReply } = require("../../structures/Utils");

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
        let state = 'SUCCESS'
        if (!command) {
            await embedReply(interaction, getEmbed('Command no Done !', process.env.RED), true, true);
            state = 'FAIL (No Done)';
        }
        else {
            try {
                if (command.info.defer) await interaction.deferReply({ ephemeral: command.info.ephemeral });
                await command.callback(interaction.client, interaction, options);
            } catch (error) {
                console.error(error);
                await embedReply(interaction, getEmbed('Command Error !', process.env.RED), true, true);
                state = `FAIL ( ${error} )`;
            } finally {
                /// Log Command
                Logger.logAppCmd(interaction, state);
            }
        }
    }
}