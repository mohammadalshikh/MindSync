const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get info about this bot.'),
        execute(interaction, client) {
            const embed = new EmbedBuilder()
                .setTitle(`About ${client.user.username}`)
                .setDescription('Task-management bot, developed by [@konstivo](https://github.com/mohammadalshikh)')
                .setColor('203D46');
            interaction.reply({embeds: [embed]});
        },
}