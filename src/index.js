const { Client, Intents, Collection } = require('discord.js');
const { resetAllMusicObject } = require('./structures/Objects');
const { loadCommands, loadEvents } = require('./structures/Utils');
require('dotenv').config()

/// Create Bot Client
const client = new Client({ 
    /// Set Intents
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
    allowedMentions: false,
    /// Set Presence
    presence: {
        status: 'dnd',
        activities: [
            {
                name: 'Coding...',
                type: 'PLAYING'
            }
        ]
    }
});

/// Add Collections
["commands", "servers"].forEach(collection => client[collection] = new Collection());

/// Setup Commands and Events
loadCommands(client, `${__dirname}/commands/`);
loadEvents(client, `${__dirname}/events/`);

/// Login to Discord API with TOKEN
client.login(process.env.TOKEN);