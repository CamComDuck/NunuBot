module.exports = {
    name: 'unstreak',
    description: 'reset the streak of players that did not compete',
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
        let counter = 0;

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        Data.find({
            registered: false
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

                        if (data.streak > 0) {
                            data.streak = 0;
                            data.onstreak = false;
                            counter = counter + 1;
                            data.save().catch(err => console.log(err));
                            message.channel.send("Name: " + data.name);
                        }

                    })
                    
                }

                const audit_embed = new Discord.RichEmbed()
                    .setTitle("Unstreak Command")
                    .setColor('fdcb58')
                    .setDescription("Command user: " + message.author.username + "\nUsers reset: " + counter);
                audit_channel.send(audit_embed);

                message.reply ("Unstreak Complete");

            }

        })
    }
}