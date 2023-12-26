const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const {Guilds, GuildMembers, GuildMessages, MessageContent} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel} = Partials;

const client = new Client({
    intents: [Guilds, GuildMessages, GuildMembers, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember, Channel]
});

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

client.commands = new Collection();

client.config = require('./config.json');
client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});