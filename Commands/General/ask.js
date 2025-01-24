const { SlashCommandBuilder } = require('discord.js');
const { getUserTasks, getSystemPrompt } = require('../../Handlers/dataHandler');
const { getZoneDate } = require('../../Handlers/timeHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask anything task-related.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Enter your question.')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        const { options, user, client } = interaction;

        const timeNow = getZoneDate(user.id)
        const tasksData = getUserTasks(user.id);

        const question = options.getString('question');
        
        let prompt = getSystemPrompt();
        prompt = prompt + `\nCurrent time:\n${timeNow}\n` + `The user task data:\n${tasksData}`

        const response = await client.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: prompt},
                { role: 'user', content: question },
            ],
        }).catch((error) => {
            console.error('Error with OpenAI:', error);
            interaction.reply('There was an issue processing your input. Please try again later.');
        })
        

        const reply = response.choices[0].message.content.trim();

        await interaction.editReply(`Question: \`${question}\`\n\n${reply}`);
    },
}