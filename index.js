require('dotenv/config');
const discord = require('discord.js');

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.MessageContent,
        discord.GatewayIntentBits.DirectMessages
    ],
    partials: [
        discord.Partials.Message,
        discord.Partials.Channel,
        discord.Partials.GuildMember,
        discord.Partials.User,
        discord.Partials.GuildScheduledEvent
    ]
});

client.on('ready', () => {
    console.log(`${client.user.username} is online.`)
});

const CHANNELS = ['1188317266757029898'];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("!")) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    message.reply("You said: " + message.content);
});

client.login(process.env.TOKEN)