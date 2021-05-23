const axios = require("axios")

module.exports = {
    name: "pull",
    run: async (client, message, args) => {

        const userData = await axios.default.get(`http://localhost:3001/api/users/${message.author.id}`);

        const valueToPull = args[0];
        if (!valueToPull) return message.reply("Insert value to pull");
        if (userData.data.bank < valueToPull) return message.reply("You don't have that amount in bank");

        const pullCoins = await axios.default.put(`http://localhost:3001/api/users/${message.author.id}/pull`, {
            bank: valueToPull
        }).catch(e => {
            message.reply("Error to on pull");
        });

        return message.reply(`Pull sucess! drawer: $${valueToPull}`);
    }
}