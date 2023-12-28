const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, PermissionFlagBits, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('task')
        .setDescription('Create a new task.')
        .addStringOption(option =>
            option.setName('name')
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
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('task-complete')
                    .setLabel('Complete')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('task-delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

            const {options, user} = interaction;
            const name = options.getString('name');
            const due = options.getString('due');
            const at = options.getString('at');

            if (due) {
                const dateParts = due.split('/');
                const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                const match = due.match(dateRegex)

                if (dateParts.length === 3 && match) {
                    const day = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1;
                    const year = parseInt(dateParts[2], 10);

                    if (day < 1 || day > 31 || month < 0 || month > 11) {
                        await interaction.reply('Invalid date format. Please enter a valid date.');
                        return;
                    }

                    dueDate = new Date(year, month, day);
                    if (at) {
                        const timeParts = at.split(':');

                        if (timeParts.length === 2) {
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                                await interaction.reply('Invalid time format. Please enter a valid time.');
                                return;
                            }
                            dueDate.setHours(hours, minutes, 0, 0);
                        } else {
                            await interaction.reply('Invalid time format. Please enter a valid time.');
                            return;
                        }
                    }

                    if (dueDate < new Date()) {
                        await interaction.reply('The due date and time cannot be before the present. Please enter a valid date and time');
                        return;
                    }

                    const timeLeftMilliseconds = dueDate.getTime() - Date.now();
                    const daysLeft = Math.floor(timeLeftMilliseconds / (1000 * 60 * 60 * 24));
                    const hoursLeft = Math.floor((timeLeftMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutesLeft = Math.floor((timeLeftMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                    const embed = new EmbedBuilder()
                        .setFields(
                            { name: 'Task', value: `${name}`, inline: false },
                            { name: 'Due', value: `${dueDate.toDateString()} at ${formatTime(dueDate.getHours())}:${formatTime(dueDate.getMinutes())}`, inline: false },
                            { name: 'Time left', value: `${daysLeft} days, ${hoursLeft} hours, and ${minutesLeft} minutes`, inline: true },
                            { name: 'Status', value: 'In progress', inline: false },
                        )
                        .setColor('203D46');

                    await interaction.reply({
                        embeds: [embed],
                        components: [buttons],
                        content: `Successfully created a new task.`
                    });
                } else {
                    await interaction.reply('Invalid date format. Please enter a valid date.');
                    return;
                }
            } else {
                if (at) {
                    const timeParts = at.split(':');

                    if (timeParts.length === 2) {
                        const hours = parseInt(timeParts[0], 10);
                        const minutes = parseInt(timeParts[1], 10);

                        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                            await interaction.reply('Invalid time format. Please enter a valid time.');
                            return;
                        }

                        dueDate = new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(), 
                            new Date().getDate(), 
                            hours,
                            minutes
                        );
                        
                        if (dueDate < new Date()) {
                            await interaction.reply('The due date and time cannot be before the present. Please enter a valid date and time');
                            return;
                        }

                        const timeLeftMilliseconds = dueDate.getTime() - Date.now();
                        const daysLeft = Math.floor(timeLeftMilliseconds / (1000 * 60 * 60 * 24));
                        const hoursLeft = Math.floor((timeLeftMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutesLeft = Math.floor((timeLeftMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                        const embed = new EmbedBuilder()
                            .setFields(
                                { name: 'Task', value: `${name}`, inline: false },
                                { name: 'Due', value: `${dueDate.toDateString()} at ${formatHourTime(dueDate.getHours())}:${formatMinTime(dueDate.getMinutes())}`, inline: false },
                                { name: 'Time left', value: `${daysLeft} days, ${hoursLeft} hours, and ${minutesLeft} minutes`, inline: true },
                                { name: 'Status', value: 'In progress', inline: false },
                            )
                            .setColor('203D46');

                        await interaction.reply({
                            embeds: [embed],
                            components: [buttons],
                            content: `Successfully created a new task.`
                        });

                    } else {
                        await interaction.reply('Invalid time format. Please enter a valid time.');
                        return;
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setFields(
                            { name: 'Task', value: `${name}`, inline: false },
                            { name: 'Status', value: 'In progress', inline: false },
                        )
                        .setColor('203D46');

                    await interaction.reply({
                        embeds: [embed],
                        components: [buttons],
                        content: `Successfully created a new task.`,
                    });
                }
            }
        },
}

function formatHourTime(time) {
    return time < 1 ? `0${time}` : `${time}`;
}

function formatMinTime(time) {
    return time < 10 ? `0${time}` : `${time}`;
}

