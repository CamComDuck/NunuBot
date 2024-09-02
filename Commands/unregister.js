module.exports = {
    name: 'unregister',
    description: 'unregister for the next tournament',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const fs = require("fs");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const registered_channel = CLIENT.channels.get('916201261903265852');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json")
        CLIENT.registered_num = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/registered_num.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        // #bot-commands
        // if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
        //     return message.reply ("This is not the correct channel for bot commands.");
        // }

        var error_embed = new Discord.RichEmbed()
            .setTitle("An error has occured.")
            .setColor('#d41616')
            .setFooter("If you believe this is a mistake, please message Cam Com.");

        Data.findOne ({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log (err);
            if (!data) {
                var data = new Data({
                    name: message.author.username,
                    userID: message.author.id,
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

                error_embed.setDescription("You are not registered for the current tournament");
                message.channel.send(error_embed);

            } else if (data.registered === false) {
    
                error_embed.setDescription("You are not registered for the current tournament");
                message.channel.send(error_embed);

            } else {
                data.group = 0;
                data.registered = false;
                data.save().catch(err => console.log(err));


                try {
                    var new_num = CLIENT.registered_num.num -= 1;
                } catch (err) {
                    var new_num = 0;
                }
                
                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/registered_num.json", JSON.stringify (CLIENT.registered_num, null, 4), err => {
                    if (err) throw err;
                })

                var user_embed = new Discord.RichEmbed()
                    .setTitle("UnRegistration Complete")
                    .setColor('#B721FF')
                    .setDescription("You have unregistered from the next Celestial Clash tournament. You may re-register whenever you want.\n\nPeople Registered: " + new_num)
                    .setThumbnail(message.author.displayAvatarURL);
                message.channel.send(user_embed);

                var user_profile = new Discord.RichEmbed()
                    .setTitle("Player UnRegistered")
                    .setColor('#d41616')
                    .setDescription("Amount of people registered: " + new_num)
                    .addField("Player Info", "Name: " + message.author.username + "\nOP.GG Link: " + data.opgg);
                registered_channel.send(user_profile);
            }
        })
    }
}