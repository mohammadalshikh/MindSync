const { SlashCommandBuilder } = require('discord.js');
const { setTimezone } = require('../../Handlers/dataHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Set your current timezone.')
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices(
                    { name: 'America/Toronto', value: 'America/Toronto' },
                    { name: 'America/Chicago', value: 'America/Chicago' },
                    { name: 'America/Denver', value: 'America/Denver' },
                    { name: 'America/Vancouver', value: 'America/Vancouver' },
                    { name: "Europe/London", value: "Europe/London" },
                    { name: "Europe/Paris", value: "Europe/Paris" },
                    { name: "Europe/Kyiv", value: "Europe/Kyiv" },
                    { name: "Europe/Istanbul", value: "Europe/Istanbul" },
                    { name: "Asia/Damascus", value: "Asia/Damascus" },
                    { name: "Asia/Qatar", value: "Asia/Qatar" },
                    { name: "Asia/Muscat", value: "Asia/Muscat" },
                    { name: "Indian/Maldives", value: "Indian/Maldives" },
                    { name: "Asia/Bangkok", value: "Asia/Bangkok" },
                    { name: "Asia/Manila", value: "Asia/Manila" },
                    { name: "Asia/Tokyo", value: "Asia/Tokyo" },
                    { name: "Australia/Sydney", value: "Australia/Sydney" },
                    { name: "Pacific/Auckland", value: "Pacific/Auckland" },
                )
        ),

    async execute(interaction) {
        const { options, user } = interaction
        setTimezone(user.id, options.getString('timezone'))
        await interaction.reply({content: `Timezone is successfully set to: \`${options.getString('timezone')}\``, ephemeral: true})
    }
}