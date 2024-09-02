module.exports = {
    name: 'warn',
    description: 'warn a user for breaking a rule',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json")
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        let user = message.mentions.users.first() || CLIENT.users.get(args[1]);
        if (!user) return message.reply ("Sorry, couldn't find that user.");
        if (user.id === message.author.id) return message.reply ("You can't warn yourself!");

        Data.findOne ({
            userID: user.id
        }, (err, data) => {

            if (err) console.log (err);
            if (!data) {

                var data = new Data ({
                    name: user.username,
                    userID: user.id,
                    lb: "all",
                    money: 0,
                    warns: 1,
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

                data.warns += 1;
                data.save().catch(err => console.log(err));

            }

            const person_receiving = new Discord.RichEmbed()
                .setTitle("Warning Given")
                .setColor("B721FF")
                .setDescription("You have received a warning. You now have " + data.warns + " warnings.");
            user.send (person_receiving);

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Warning Command")
                .setColor('fdcb58')
                .setDescription("Command user: " + message.author.username + "\nUser warned: " + data.name + "\nTotal Warnings: " + data.warns);
            audit_channel.send(audit_embed);

            return message.channel.send(data.name + " has been warned. They now have " + data.warns + " warnings.");

        })
    }
}