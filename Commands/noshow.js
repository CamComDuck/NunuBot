module.exports = {
    name: 'noshow',
    description: 'unregister a user that did not show up',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json")
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        let user = message.mentions.users.first() || CLIENT.users.get(args[1])
        if (!user) return message.reply ("Sorry, couldn't find that user.");

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
                message.reply ("User had no data, created data for them.");

            } else {

                data.registered = false;
                data.save().catch(err => console.log(err));
                message.reply ("User has been unregistered");

            }



            const audit_embed = new Discord.RichEmbed()
                .setTitle("NoShow Command")
                .setColor('fdcb58')
                .setDescription("Command user: " + message.author.username + "\nUser unregistered: " + user.username);
            audit_channel.send(audit_embed);

        })
    }
}