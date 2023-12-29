const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get info about this bot.'),
        execute(interaction, client) {
            const embed = new EmbedBuilder()
                .setTitle(`About ${client.user.username}`)
                .setDescription('Task-management bot with real-time updating')
                .setFields(
                    { name: '1. Deletion', value: 'Any task can be deleted before its due date.' },
                    { name: '2. Saving', value: 'All tasks except the ones deleted by user will be saved, and can be viewed using the \`\`/list\`\` command later on.'},
                    { name: '3. Task embeds', value: 'Once created, make sure to pin/keep the task embed as **it\'s the only way to interact with tasks.**' },
                    { name: '4. Live updating', value: 'Time left for each task will be updated every minute.' },
                    { name: '5. Expiry', value: 'Expired tasks that were not completed will automatically be labeled "Unfinished", and the user will not be able to interact with them anymore.'},
                    { name: 'Developed by', value: '[@konstivo](https://github.com/mohammadalshikh)', inline: false},
                )
                .setColor('203D46');
            interaction.reply({embeds: [embed]});
        },
}