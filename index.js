const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const {Guilds, GuildMembers, GuildMessages, MessageContent} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel} = Partials;
require('dotenv').config();

const client = new Client({
    intents: [Guilds, GuildMessages, GuildMembers, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember, Channel]
});

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

client.commands = new Collection();

client.login(process.env.TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});