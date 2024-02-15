const { SlashCommandBuilder } = require('discord.js');
const { getTaskIdx, deleteTask, getInterval } = require('../../Handlers/dataHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a task.')
        .addStringOption(option => 
            option.setName('task')
                   .setDescription('Enter task name to delete.') 
                    .setRequired(true)
        ),

        async execute(interaction) {
            const {options, user} = interaction
            const name = options.getString('task');

            if (getTaskIdx(user.id, name) == -1) {
                await interaction.reply({ content: `Task with name \`${name}\` could not be found.`, ephemeral: true})
                return
            } else {                
                await interaction.channel.messages.fetch({ limit: 100 })
                    .then(messages => {
                        const m = messages.filter(
                            message => message.hasOwnProperty('components') &&
                                message.components.length == 1 &&
                                message.components[0].hasOwnProperty('data')
                        )
                        m.forEach((message, messageId) => {
                            if (message.components[0].components[0].data.custom_id.split('-')[2] == user.id
                                && message.components[0].components[0].data.custom_id.split('-')[3] == name) {
                                
                                message.delete();
                                clearInterval(getInterval(user.id, name))
                                console.log('Original message is deleted.')
                            }
                        })
                    })
                    .catch(console.error);

                deleteTask(user.id, name)
                await interaction.reply({ content: "Task is successfully deleted.", ephemeral: true });
                return
            }
        },
}