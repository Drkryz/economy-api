const axios = require('axios');

module.exports = {
    name: "payCommand",
    run: async (client, message, args) => {

        const userData = await axios(`http://localhost:3001/api/users/${message.author.id}`, {
            method: 'GET'
        });

        console.log(userData.data.user);

        const userToPay = message.mentions.users.first();

        if (!userToPay) return message.reply("Please, mention user first");

        const valueToPay = args[1]
        // check values
        if (!valueToPay) return message.reply("Insert value to pay user");
        if (userData.data.user.coins < valueToPay) return message.reply("You don't have that amount");

        // pay User
        const payUser = await axios.default.put(`http://localhost:3001/api/users/${message.author.id}/${userToPay.id}/pay`, {
            "coins": valueToPay
        }).catch(e => {
            return message.reply("Error to on pay user")
        });

        return message.reply(`Pay success! paid $${valueToPay} for ${userToPay}`);
    }
}