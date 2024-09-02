module.exports = {
    name: 'adminpay',
    description: 'allows an admin to give CC to a user',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        let user = message.mentions.users.first() || CLIENT.users.get(args[1])
        if (!user) return message.reply ("Sorry, couldn't find that user.");
        if (!args[2]) return message.reply ("Please specify the amount you want to pay.");
        //if (user.id === message.author.id) return message.reply ("You can't pay yourself!");

        Data.findOne ({
            userID: user.id
        }, (err, data) => {

            if (err) console.log (err);
            if (!data) {

                var data = new Data ({
                    name: user.username,
                    userID: user.id,
                    lb: "all",
                    money: parseInt(args[2]),
                    warns: 0,
                    rank: "All ranks are updated each night",
                    role: "Enter your role with +profile (role)",
                    opgg: "Enter your OP.GG with +profile (opgg)",
                    wins: 0,
                    losses: 0,
                    registered: false,
                    streak: 0,
                    onstreak: false,
                    group: 0
                })

                data.save().catch(err => console.log(err));

            } else {

                data.money += parseInt(args[2]);
                data.save().catch(err => console.log(err));

            }

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Adminpay Command")
                .setColor('fdcb58')
                .setDescription("Command user: " + message.author.username + "\nMoney given: " + args[2] + "\nReceiver: " + data.name + "\nNew balance: " + data.money);
            audit_channel.send(audit_embed);

            const person_receiving = new Discord.RichEmbed()
                .setTitle("Received Celestial Coins")
                .setColor("B721FF")
                .setDescription("You received " + args[2] + " Celestial Coins. You now have " + data.money + " Celestial Coins.");
            user.send (person_receiving);

            return message.channel.send (data.name + " now has " + data.money + " Celestial Coins after being given " + args[2] + ".");
        })
    }
}