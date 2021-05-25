const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

const client = new Client();

client.commands = new Collection();

// commandHandler
const commandsFolder = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));
for (const file of commandsFolder) {
    const cmdName = file.split(".")[0];
    const props = require(`./commands/${file}`);
    
    client.commands.set(cmdName, props)
}

const PREFIX = "!";

client.on("ready", async() => {
    console.log(`On in ${client.user.tag}`);

    await mongoose.connect("mongodb://localhost:27017/userData?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
});

// manipuling message
client.on("message", async (message) => {

    if (message.author.bot) return;

    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = await client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
});

client.login("");