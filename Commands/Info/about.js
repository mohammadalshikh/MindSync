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
                    { name: '1. Deletion', value: 'Any task can be deleted at any time.' },
                    { name: '2. Saving', value: 'All tasks except the ones deleted by user will be saved, and can be viewed using the \`\`/list\`\` command later on.'},
                    { name: '3. Live updating', value: 'Once created, tasks embeds will update every 10 seconds, showing the new time left for tasks.' },
                    { name: '4. Expiry', value: 'Expired incomplete tasks will automatically be labeled "Unfinished", and the user will not be able to interact with them anymore.'},
                    { name: '5. Timezones', value: 'The default user\'s timezone is set to Eastern Standard Time.' },
                    { name: 'Developed by', value: '[@konstivo](https://github.com/mohammadalshikh)', inline: false},
                )
                .setColor('203D46');
            interaction.reply({embeds: [embed]});
        },
}