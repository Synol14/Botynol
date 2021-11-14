const { Client, Intents, Collection } = require('discord.js');
const { loadCommands, loadEvents } = require('./Utils');
require('dotenv').config()

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

/// Add Collections
["commands", "servers"].forEach(collection => client[collection] = new Collection());

client.once('ready', () => {
    /// Set Presence
    client.user.setStatus('dnd');
    client.user.setActivity({
        name: 'Coding...',
        type: 'PLAYING'
    })

    /// Setup Bot
    loadCommands(client);
    loadEvents(client);

    /// Logging
    console.log(`\n[Info]  Bot Ready ( ${client.user.tag} - ${client.user.id} )\n`);
});

client.login(process.env.TOKEN);