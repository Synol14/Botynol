const { Client } = require("discord.js");
const { Logger } = require("../../structures/Logger");
const { resetAllMusicObject } = require("../../structures/Objects");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * Execute Event
     * @param {Client} client Application Bot Client
     */
    async execute(client) {
        /// Set Bot
        resetAllMusicObject(client);

        /// Logging
        Logger.blankLine();
        Logger.info(`Bot Ready ( ${client.user.tag} - ${client.user.id} )\n\n`);
    }
}