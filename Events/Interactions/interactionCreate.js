const {CommandInteraction} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            interaction.reply({content: 'Outdated command'})
        }

        command.execute(interaction, client);
    },
};