const axios = require('axios')

module.exports = {
    name: "deposit",
    run: async (client, message, args) => {

        const userData = await axios.default.get(`http://localhost:3001/api/users/${message.author.id}`);

        const valueToDeposit = args[0]
        if (!valueToDeposit) return message.reply("Insert value to deposit");

        if (userData.data.user.coins < valueToDeposit) return message.reply("You don't have that amount");

        const depCoins = await axios.default.put(`http://localhost:3001/api/users/${message.author.id}/deposit`, {
            coins: valueToDeposit
        }).catch(e => {
            message.reply("Error to on deposit");
        })
        console.log(depCoins);

        return message.reply(`Deposit success!, deposited $${valueToDeposit}`);
    }
}