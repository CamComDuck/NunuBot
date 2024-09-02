module.exports = {
    name: 'join',
    description: 'join the next tournament',
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

                error_embed.setDescription("Please enter your role and OP.GG first. Use +help for commands.\nExample of how to register:" +
                "\n+profile enterRoleHere\n+profile https://na.op.gg/summoner/userName=Cam+Com\n+join");
                message.channel.send(error_embed);

            } else if (data.registered === true) {
    
                error_embed.setDescription("You are already signed up for the current tournament.");
                message.channel.send(error_embed);

            } else if (data.role === "Enter your role with +profile (role)" || data.opgg === "Enter your OP.GG with +profile (opgg)") {
                
                error_embed.setDescription("Please enter your role and OP.GG first. Use +help for commands.\nExample of how to register:" +
                "\n+profile enterRoleHere\n+profile https://na.op.gg/summoner/userName=Cam+Com\n+join");
                message.channel.send(error_embed);

            } else if (data.warns > 0) {
                
                error_embed.setDescription("You are not allowed to register for the next 2 tournaments.");
                message.channel.send(error_embed);

            } else {
                if (!args[1]) {
                    var captain_pick = "No";
                } else if (args[1].toLowerCase() === "captain") {
                    data.group = 1;
                    var captain_pick = "Yes";
                }
                data.registered = true;
                data.save().catch(err => console.log(err));


                try {
                    var new_num = CLIENT.registered_num.num += 1;
                } catch (err) {
                    var new_num = 1;
                }
                
                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/registered_num.json", JSON.stringify (CLIENT.registered_num, null, 4), err => {
                    if (err) throw err;
                })

                var user_embed = new Discord.RichEmbed()
                    .setTitle("Registration Complete")
                    .setColor('#B721FF')
                    .setDescription("Thank you for registering for the Cam Cave Clash!\n\nPeople Registered: " + new_num)
                    .setFooter("By registering you agree to all the rules.")
                    .setThumbnail(message.author.displayAvatarURL);

                var user_embed_captain = new Discord.RichEmbed()
                    .setTitle("Registration Complete")
                    .setColor('#B721FF')
                    .setDescription("Thank you for registering for the next Cam Cave Clash as a captain! "+
                    "You will be contacted the day prior with more information if you are chosen.\n\nPeople Registered: " + new_num)
                    .setFooter("By registering you agree to all the rules.")
                    .setThumbnail(message.author.displayAvatarURL);

                if (captain_pick === "Yes") {
                    message.channel.send(user_embed_captain);
                } else {
                    message.channel.send(user_embed);
                }


                var user_profile = new Discord.RichEmbed()
                    .setTitle("Player Registered")
                    .setColor('#B721FF')
                    .setDescription("Amount of people registered: " + new_num)
                    .addField("Player Info", "Name: " + message.author.username + "\nOP.GG Link: " + data.opgg + "\nRank: " + data.rank + "\nRole: " + data.role + "\nCaptain? " + captain_pick);
                registered_channel.send(user_profile);
            }
        })
    }
}