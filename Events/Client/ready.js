const {Client} = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        client.user.setActivity('Life');
        console.log(`${client.user.username} is now online.`);
    },
};