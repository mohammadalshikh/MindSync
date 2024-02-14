const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateTask, getDueDate, getMessageId, getInterval, getTaskIdx } = require('../../Handlers/dataHandler');
const { timeLeft, formatHourTime, formatMinTime } = require('../../Handlers/timeHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('complete')
        .setDescription('Complete a waiting task.')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('Enter task name.')
                .setRequired(true)
        ),
    
        async execute(interaction) {

            const { options, user } = interaction;
            const name = options.getString('task');

            if (getTaskIdx(user.id, name) == -1) {
                await interaction.reply({content: `Task with name: ${name} could not be found.`, ephemeral: true})
                return
            } else {
                dueDate = getDueDate(user.id, name)
                if (dueDate.toDateString() != 'Wed Dec 31 1969') {
                    const time = timeLeft(dueDate)
                    if (time == -1) {
                        // updateTask(user.id, name, 'Unfinished')
                    } else {
                        const embed = new EmbedBuilder()
                            .setFields(
                                { name: 'Task', value: `${name}`, inline: false },
                                { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                { name: 'Time left', value: `${time.days} days, ${time.hours} hours, and ${time.minutes} minutes`, inline: false },
                                { name: 'Status', value: 'Completed', inline: false },
                            )
                            .setColor('Green');

                        clearInterval(getInterval(user.id, name))
                        updateTask(user.id, name, 'Completed')
                    
                        try {
                            const messageId = getMessageId(user.id, name)
                            const message = await interaction.channel.messages.fetch(messageId);
                            await message.edit({
                                components: []
                            });
                            console.log("Components removed successfully.");
                        } catch (error) {
                            console.error("Error removing components:", error);
                        }
                        
                        await interaction.reply({
                            embeds: [embed],
                            content: 'Task successfully completed! 💪'
                        })
                    }
                } else {
                    updateTask(user.id, name, 'Completed')
                    const embed = new EmbedBuilder()
                        .setFields(
                            { name: 'Task', value: `${name}`, inline: false },
                            { name: 'Status', value: 'Completed', inline: false },
                        )
                        .setColor('Green');

                    await interaction.reply({
                        embeds: [embed],
                        content: 'Task successfully completed! 💪'
                    })
                }
            }
        },
}