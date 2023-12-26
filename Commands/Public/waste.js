const{SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');

var counter = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waste')
        .setDescription('Got some time to waste? try this.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only for admins
        execute(interaction) {
            if (counter == 0) {
                interaction.reply({ content: 'Thanks for using this command. That was very productive from you.', ephemeral: true }) // Only visible to user
                counter++;
            } else if (counter == 1) {
                interaction.reply({ content: "Oh, you're back again. Who needs to be productive anyways.", ephemeral: true })
                counter++;
            } else if (counter == 2) {
                interaction.reply({ content: "Another break? You're really mastering the art of procrastination.", ephemeral: true })
                counter++;
            } else if (counter == 3) {
                interaction.reply({ content: "Okay, seriously now, are you ever going to do any work?", ephemeral: true })
                counter++;
            } else if (counter == 4) {
                interaction.reply({ content: "You've reached a new level of productivity: the expert at doing nothing.", ephemeral: true });
                counter++;
            } else {
                interaction.reply({ content: "Congratulations! You've successfully reached the last if statement in my code. Thank you for appreciating my time as a developer.", ephemeral: true });
                counter = 0;
            }
        },
};