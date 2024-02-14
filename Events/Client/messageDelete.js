const { Client } = require('discord.js');
const { setMessageState } = require('../../Handlers/dataHandler')

module.exports = {
    name: 'messageDelete',
    once: false,
    execute(deletedMessage) {
        const userId = deletedMessage.components[0].components[0].data.custom_id.split('-')[2]
        const name = deletedMessage.components[0].components[0].data.custom_id.split('-')[3]
        setMessageState(userId, name)
    },
}