const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get info about this bot.'),
        execute(interaction, client) {
            const embed = new EmbedBuilder()
                .setTitle(`About ${client.user.username}`)
                .setDescription('Task-management bot with AI-assistance and real-time updating')
                .setFields(
                    { name: '1. AI-assistance', value: 'Utilizing OpenAI\' GPT-4o mini, this bot can assist users with their tasks and offer strategic approaches to them.' },
                    { name: '2. Deletion', value: 'Any task can be deleted at any time.' },
                    { name: '3. Saving', value: 'All tasks except the ones deleted by user will be saved, those can be viewed using the \`\`/list\`\` command later on.'},
                    { name: '4. Live updates', value: 'Once created, tasks embeds will update every 10 seconds, showing the new time left for tasks.' },
                    { name: '5. Expiry', value: 'Expired incomplete tasks will automatically be labeled "Unfinished", and the user will not be able to interact with them anymore.'},
                    { name: '6. Timezones', value: 'The default timezone is set to Eastern Standard Time.' },
                    { name: 'Developed by', value: '[@konstivo](https://github.com/mohammadalshikh)', inline: false},
                )
                .setColor('203D46');
            interaction.reply({embeds: [embed]});
        },
}