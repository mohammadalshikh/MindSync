const { EmbedBuilder } = require('discord.js');
const { updateTask, deleteTask, getDueDate, getInterval, getStatus } = require('../../Handlers/dataHandler');
const { timeLeft } = require('../../Handlers/timeHandler');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const { member, customId } = interaction;

        if (!interaction.isButton()) return;

        if (customId.startsWith('task-delete') || customId.startsWith('task-complete')) {
            if (member.user.id !== customId.split('-')[2]) {
                return interaction.reply({ content: "You can't complete or delete other people's tasks!", ephemeral: true });
            }
            const n = customId.split('-')[3]
            const r = getStatus(member.user.id, n)
            if (r == 'Completed' || r == 'Unfinished') {
                if (customId.startsWith('task-complete')) {
                    await interaction.message.delete()
                    return interaction.reply({ content: "You can no longer interact with this task.", ephemeral: true });
                }
            }

            const embed = interaction.message.embeds[0];

            if (embed) {
                if (customId.startsWith('task-delete')) {
                    await interaction.message.delete();
                    interaction.reply({ content: "Task deleted.", ephemeral: true });
                    clearInterval(getInterval(member.user.id, embed.data.fields[0].value))
                    deleteTask(member.user.id, embed.data.fields[0].value);
                } else {
                    if (embed.data.fields[1].name === 'Status') {
                        embed.data.fields[1] = { name: 'Status', value: 'Completed', inline: false };
                        updateTask(member.user.id, embed.data.fields[0].value, 'Completed');
                    } else {
                        const dueDate = new Date(getDueDate(member.user.id, embed.data.fields[0].value));
                        const time = timeLeft(dueDate);
                        if (time == -1) {
                            embed.data.fields[3] = { name: 'Status', value: 'Unfinished', inline: false };
                            clearInterval(getInterval(member.user.id, embed.data.fields[0].value));
                            updateTask(member.user.id, embed.data.fields[0].value, 'Unfinished');
                            const completedEmbed = EmbedBuilder.from(embed).setColor('Orange');
                            await interaction.message.edit({
                                content: `\`\`(Task Unfinished)\`\``,
                                embeds: [completedEmbed],
                                components: []
                            });
                            return await interaction.reply({ content: 'The time allotted for this task has expired. You may not complete it now.', ephemeral: true });
                        } else {
                            embed.data.fields[3] = { name: 'Status', value: 'Completed', inline: false };
                            clearInterval(getInterval(member.user.id, embed.data.fields[0].value));
                            updateTask(member.user.id, embed.data.fields[0].value, 'Completed');
                        }
                    }

                    const completedEmbed = EmbedBuilder.from(embed).setColor('Green');
                    await interaction.message.edit({
                        content: `\`\`(Task Completed)\`\``,
                        embeds: [completedEmbed],
                        components: []
                    });
                    interaction.reply({ content: "Task successfully completed! 💪" });
                }
            } else {
                const name = customId.split('-')[3]
                if (customId.startsWith('task-delete')) {
                    await interaction.message.delete();
                    clearInterval(getInterval(member.user.id, name))
                    const res = deleteTask(member.user.id, name);
                    if (res) {
                        interaction.reply({ content: `Task: ${name} has been deleted.`, ephemeral: true });
                    } else {
                        interaction.reply({ content: "An error has occurred while trying to delete your task.", ephemeral: true });
                    }
                } else {
                    const date = getDueDate(member.user.id, name)
                    if (date == null) {
                        clearInterval(getInterval(member.user.id, name));
                        const res = updateTask(member.user.id, name, 'Completed');
                        await interaction.message.edit({
                            content: `\`\`(Task Completed)\`\``,
                            embeds: [],
                            components: []
                        });
                        if (res) {
                            return await interaction.reply({ content: `Task: ${name} is successfully completed! 💪` });
                        }
                    } else {
                        dueDate = new Date(date)
                        const time = timeLeft(dueDate);
                        if (time == -1) {
                            clearInterval(getInterval(member.user.id, name));
                            updateTask(member.user.id, name, 'Unfinished');
                            await interaction.message.edit({
                                content: `\`\`(Task Unfinished)\`\``,
                                embeds: [],
                                components: []
                            });
                            return await interaction.reply({ content: 'The time allotted for this task has expired. You may not complete it now.', ephemeral: true });
                        } else {
                            clearInterval(getInterval(member.user.id, name));
                            const res = updateTask(member.user.id, name, 'Completed');
                            await interaction.message.edit({
                                content: `\`\`(Task Completed)\`\``,
                                embeds: [],
                                components: []
                            });
                            if (res) {
                                return await interaction.reply({ content: `Task: ${name} is successfully completed! 💪` });
                            } else {
                                return await interaction.reply({ content: "An error has occurred while trying to complete your task.", ephemeral: true });
                            }
                        }
                    }
                }
            }
        }
    }

}