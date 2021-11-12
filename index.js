const { Client, Intents, Collection } = require('discord.js');
const { loadCommands, loadEvents, loadEventsSubDir } = require('./Utils');
require('dotenv').config()

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS]
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
    console.log(`Bot Ready ( ${client.user.tag} - ${client.user.id} )`);
});

client.login(process.env.TOKEN);