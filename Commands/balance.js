module.exports = {
    name: 'balance',
    description: 'display the balance of the user',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }
        
        if (!args[1]) {
            var user = message.author;
        } else if (args[1].startsWith("<@")) {
            var user = message.mentions.users.first() || CLIENT.users.cache.get(args[1]);
        } else {
            return message.reply ("I can't find the user you tried to view.");
        }
        

        Data.findOne ({
            userID: user.id
        }, (err, data) => {
            if (err) console.log (err);
            if (!data) {
                const data = new Data({
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
            }

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Balance Command")
                .setColor('#aa8ed6')
                .setDescription("Command user: " + message.author.username + "\nUser viewed: " + user.username);
            audit_channel.send(audit_embed);

            var user_balance = new Discord.RichEmbed()
                .setTitle(user.username)
                .setColor('#B721FF')
                .setDescription("Balance: " + data.money + " Celestial Coins") //
                .setThumbnail(user.displayAvatarURL);
            message.channel.send(user_balance);
            
        })

    }
}