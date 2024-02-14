const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const {loadUserData, saveUserData, getTaskIdx, updateTask, getDueDate, getMessageState} = require('../../Handlers/dataHandler');
const { formatHourTime, formatMinTime, timeLeft, convertTimezone} = require('../../Handlers/timeHandler');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('Create a new task.')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('Name your task.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('due')
                .setDescription('Enter a due date (DD/MM/YYYY).')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('at')
                .setDescription('Enter a time using the 24-hour clock system, e.g. 17:45 (HH:MM).')
                .setRequired(false)
        ),

        async execute(interaction) {

            const userData = loadUserData();

            const {options, user} = interaction;

            const name = options.getString('task');
            const due = options.getString('due');
            const at = options.getString('at');

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`task-complete-${user.id}-${name}`)
                    .setLabel('Complete')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`task-delete-${user.id}-${name}`)
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

            if (getTaskIdx(user.id, name) != -1) {
                await interaction.reply({ content: "You can't have two tasks with the same name. Please enter a different name for your task.", ephemeral: true});
                return;
            }

            if (due) {
                const dateParts = due.split('/');
                const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                const match = due.match(dateRegex)

                if (dateParts.length === 3 && match) {
                    const day = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1;
                    const year = parseInt(dateParts[2], 10);

                    if (day < 1 || day > 31 || month < 0 || month > 11) {
                        await interaction.reply({content: 'Invalid date format. Please enter a valid date.', ephemeral: true});
                        return;
                    }

                    dueDate = new Date(year, month, day);
                    if (at) {
                        const timeParts = at.split(':');

                        if (timeParts.length === 2) {
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                                await interaction.reply({ content: 'Invalid time format. Please enter a valid time.', ephemeral: true });
                                return;
                            }
                            dueDate.setHours(hours, minutes, 0, 0);
                        } else {
                            await interaction.reply({ content: 'Invalid time format. Please enter a valid time.', ephemeral: true });
                            return;
                        }
                    }
                    
                    const currentTimeInUserTimezone = convertTimezone(new Date());

                    if (currentTimeInUserTimezone > dueDate) {
                        await interaction.reply({content: 'The due date and time cannot be before the present. Please enter a valid date and time.', ephemeral: true});
                        return;
                    }

                    const time = timeLeft(dueDate);

                    const embed = new EmbedBuilder()
                        .setFields(
                            { name: 'Task', value: `${name}`, inline: false },
                            { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                            { name: 'Time left', value: `${time.days} days, ${time.hours} hours, and ${time.minutes} minutes`, inline: false },
                            { name: 'Status', value: 'In progress', inline: false },
                        )
                        .setColor('203D46');

                    const initialMessage = await interaction.reply({
                        embeds: [embed],
                        components: [buttons],
                        content: 'Successfully created a new task:'
                    });

                    const interval = setInterval(() => {
                        const dueDate = getDueDate(user.id, name)
                        const updatedTime = timeLeft(dueDate);
                        if (updatedTime < 0) {
                            const updatedEmbed = new EmbedBuilder()
                                .setFields(
                                    { name: 'Task', value: `${name}`, inline: false },
                                    { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                    { name: 'Time left', value: `0 days, 0 hours, and 0 minutes`, inline: false },
                                    { name: 'Status', value: 'Unfinished', inline: false },
                                )
                                .setColor('Orange');
                            updateTask(user.id, name, 'Unfinished');
                            if (getMessageState(user.id, name) == false) {
                                initialMessage.edit({
                                    content: `\`\`(Task Unfinished)\`\``,
                                    embeds: [updatedEmbed],
                                    components: [],
                                });
                            } 
                            clearInterval(interval);
                            return;
                        } else {
                            const updatedEmbed = new EmbedBuilder()
                                .setFields(
                                    { name: 'Task', value: `${name}`, inline: false },
                                    { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                    { name: 'Time left', value: `${updatedTime.days} days, ${updatedTime.hours} hours, and ${updatedTime.minutes} minutes`, inline: false },
                                    { name: 'Status', value: 'In progress', inline: false },
                                )
                                .setColor('203D46');
                            
                            if (getMessageState(user.id, name) == false) {
                                initialMessage.edit({
                                    embeds: [updatedEmbed],
                                    components: [buttons],
                                });
                            }
                        }
                    }, 10000);

                    const taskData = {
                        name: name,
                        due: dueDate,
                        status: 'In progress',
                        interval: `${interval}`,
                        messageId: initialMessage.id,
                        deletedMsg: false
                    };

                    if (!userData[user.id]) {
                        userData[user.id] = [];
                    }

                    userData[user.id].push(taskData);
                    saveUserData(userData);
                } else {
                    await interaction.reply({ content: 'Invalid date format. Please enter a valid date.', ephemeral: true });
                    return;
                }
            } else {
                if (at) {
                    const timeParts = at.split(':');

                    if (timeParts.length === 2) {
                        const hours = parseInt(timeParts[0], 10);
                        const minutes = parseInt(timeParts[1], 10);

                        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                            await interaction.reply({ content: 'Invalid time format. Please enter a valid time.', ephemeral: true });
                            return;
                        }

                        dueDate = new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(), 
                            new Date().getDate(), 
                            hours,
                            minutes
                        );

                        const currentTimeInUserTimezone = convertTimezone(new Date());
                        
                        if (currentTimeInUserTimezone > dueDate) {
                            await interaction.reply({ content: 'The due date and time cannot be before the present. Please enter a valid date and time.', ephemeral: true });
                            return;
                        }

                        const time = timeLeft(dueDate);

                        const embed = new EmbedBuilder()
                            .setFields(
                                { name: 'Task', value: `${name}`, inline: false },
                                { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                { name: 'Time left', value: `${time.days} days, ${time.hours} hours, and ${time.minutes} minutes`, inline: true },
                                { name: 'Status', value: 'In progress', inline: false },
                            )
                            .setColor('203D46');

                        const initialMessage = await interaction.reply({
                            embeds: [embed],
                            components: [buttons],
                            content: 'Successfully created a new task:'
                        });
                        const interval = setInterval(() => {
                            const dueDate = getDueDate(user.id, name)
                            const updatedTime = timeLeft(dueDate);
                            if (updatedTime < 0) {
                                const updatedEmbed = new EmbedBuilder()
                                    .setFields(
                                        { name: 'Task', value: `${name}`, inline: false },
                                        { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                        { name: 'Time left', value: `0 days, 0 hours, and 0 minutes`, inline: false },
                                        { name: 'Status', value: 'Unfinished', inline: false },
                                    )
                                    .setColor('Orange');
                                updateTask(user.id, name, 'Unfinished');
                                
                                if (getMessageState(user.id, name) == false) {
                                    initialMessage.edit({
                                        content: `\`\`(Task Unfinished)\`\``,
                                        embeds: [updatedEmbed],
                                        components: [],
                                    });
                                }
                                clearInterval(interval);
                                return;
                            } else {
                                const updatedEmbed = new EmbedBuilder()
                                    .setFields(
                                        { name: 'Task', value: `${name}`, inline: false },
                                        { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                        { name: 'Time left', value: `${updatedTime.days} days, ${updatedTime.hours} hours, and ${updatedTime.minutes} minutes`, inline: false },
                                        { name: 'Status', value: 'In progress', inline: false },
                                    )
                                    .setColor('203D46');

                                if (getMessageState(user.id, name) == false) {
                                    initialMessage.edit({
                                        embeds: [updatedEmbed],
                                        components: [buttons],
                                    })
                                }
                            }
                        }, 10000);

                        const taskData = {
                            name: name,
                            due: dueDate,
                            status: 'In progress',
                            interval: `${interval}`,
                            messageId: initialMessage.id,
                            deletedMsg: false
                            };

                        if (!userData[user.id]) {
                            userData[user.id] = [];
                        }

                        userData[user.id].push(taskData);
                        saveUserData(userData);

                    } else {
                        await interaction.reply({ content: 'Invalid time format. Please enter a valid time.', ephemeral: true });
                        return;
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setFields(
                            { name: 'Task', value: `${name}`, inline: false },
                            { name: 'Status', value: 'In progress', inline: false },
                        )
                        .setColor('203D46');

                    const initialMessage = await interaction.reply({
                        embeds: [embed],
                        components: [buttons],
                        content: 'Successfully created a new task:',
                    });

                    const taskData = {
                        name: name,
                        due: null,
                        status: 'In progress',
                        interval: null,
                        messageId: initialMessage.id,
                        deletedMsg: false
                    };

                    if (!userData[user.id]) {
                        userData[user.id] = [];
                    }

                    userData[user.id].push(taskData);
                    saveUserData(userData);
                }
            }
        },
}