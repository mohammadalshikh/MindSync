require('dotenv/config');
const { Client } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

client.on('ready', () => {
    console.log('MindSync is online.')
});

const CHANNELS = ['1182238025955164221'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("!")) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    // name: 
                    role: 'system',
                    content: 'You are a chatbot named MindSync whose goal is to mimic my personality and style of texting.',
                },
                {
                    // name:
                    role: 'user',
                    content: message.content,
                }
            ]
        }).catch((error) => console.error('OpenAI error:\n', error));

    message.reply(response.choices[0].message.content);
});

client.login(process.env.TOKEN)