function loadCommands(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading('Commands', 'Status');

    let commandsArray = [];

    const folders = fs.readdirSync('./Commands');
    for (const folder of folders) {
        const files = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of files) {
            const command = require(`../Commands/${folder}/${file}`);

            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());

            table.addRow(file, 'loaded');
            continue;
        }
    }
    client.application.commands.set(commandsArray);

    return console.log(table.toString(), '\nLoaded commands');
}

module.exports = {loadCommands};