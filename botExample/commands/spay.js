const { default: axios } = require("axios")

const random = require('randomstring');
const KeySession = require('../database/models/Key');


// example pay session

module.exports = {
    name: "spay",
    run: async (client, message, args) => {
        const key = random.generate(50);

        (await KeySession.create({ member: message.author.id, Key: key })).save();

        const response = await axios.get(`http://localhost:3001/api/private/users/${key}/${message.author.id}`).catch(e => {
            console.log("error ocurred", e);
        })
        
        console.log(response.data);
    }
}