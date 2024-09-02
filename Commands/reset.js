module.exports = {
    name: 'reset',
    description: 'used after a tourney to calculate streaks and reset registration',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const mongoose = require("mongoose");
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        const fs = require("fs");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        CLIENT.registered_num = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/registered_num.json");
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        var counter = 0;

        Data.find({
            registered: true
        }).sort([
            ['streak', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);


            if (res.length === 0) {
                return message.reply ("There aren't any data entries.");
            } else {

                for (i = 0; i < res.length; i++) {

                    Data.findOne ({
                        userID: res[i].userID
                    }, (err, data) => {

                        if (err) console.log(err);
                        
                        data.registered = false;
                        data.streak += 1;
                        if (data.streak >= 2) data.onstreak = true;
                        if (data.onstreak) data.money += 5*data.streak;
                        data.group = 0;
                        data.save().catch(err => console.log(err));
                        counter += 1;

                        message.channel.send("Name: " + data.name + " | Coins: " + data.money + " | Streak: " + data.streak);

                    })
                    
                }

                CLIENT.registered_num.num = 0;
                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/registered_num.json", JSON.stringify (CLIENT.registered_num, null, 4), err => {
                    if (err) throw err;
                })

                const audit_embed = new Discord.RichEmbed()
                    .setTitle("Reset Command")
                    .setColor('fdcb58')
                    .setDescription("Command user: " + message.author.username + "\nUsers reset: " + counter);
                audit_channel.send(audit_embed);

                message.reply ("Reset Complete");

            }

        })
    }
}