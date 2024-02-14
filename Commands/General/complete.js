const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateTask, getDueDate, getMessageId, getInterval, getTaskIdx, getStatus } = require('../../Handlers/dataHandler');
const { timeLeft, formatHourTime, formatMinTime } = require('../../Handlers/timeHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('complete')
        .setDescription('Complete a pending task.')
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
                const status = getStatus(user.id, name)
                if (status == 'Completed') {
                    await interaction.reply({ content: `This task is already completed. You can check the list of current tasks by executing \`/list\` command.`, ephemeral: true })
                    return
                } else if (status == 'Unfinished') {
                    await interaction.reply({ content: `This task is set to unfinished. You may not complete it now. You can check the list of current tasks by executing \`/list\` command.`, ephemeral: true })
                    return
                } else {
                    dueDate = getDueDate(user.id, name)
                    if (dueDate.toDateString() != 'Wed Dec 31 1969') {
                        const time = timeLeft(dueDate)
                        if (time == -1) {
                            clearInterval(getInterval(user.id, name))
                            const embed = new EmbedBuilder()
                                .setFields(
                                    { name: 'Task', value: `${name}`, inline: false },
                                    { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                    { name: 'Time left', value: `0 days, 0 hours, and 0 minutes`, inline: false },
                                    { name: 'Status', value: 'Unfinished', inline: false },
                                )
                                .setColor('Orange');
                            updateTask(user.id, name, 'Unfinished')
    
                            await interaction.reply({
                                embeds: [embed],
                                content: 'The time allotted for this task has expired. You may not complete it now.'
                            })
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
            }
        },
}