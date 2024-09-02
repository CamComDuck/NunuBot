module.exports = {
    name: 'groupadd',
    description: 'add a person to a group',
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

        var group_letter = args[2].toLowerCase();

        if (group_letter != "a" && group_letter != "b" && group_letter != "c" && group_letter != "d" && group_letter != "e") {
            return message.reply ("That is not a valid group letter.");
        }

        let user = message.mentions.users.first() || CLIENT.users.get(args[1])
        if (!user) return message.reply ("Sorry, couldn't find that user.");
        if (!args[2]) return message.reply ("Please specify the group you want this person to be in.");
        //if (user.id === message.author.id) return message.reply ("You can't pay yourself!");

        switch (group_letter) {
            case 'a':
                var group_number = 1;
                break;
            
            case 'b':
                var group_number = 2;
                break;

            case 'c':
                var group_number = 3;
                break;

            case 'd':
                var group_number = 4;
                break;

            case 'e':
                var group_number = 5;
                break;
        }

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
                    group: group_number
                })

                data.save().catch(err => console.log(err));

            } else {

                data.group = group_number;
                data.save().catch(err => console.log(err));

            }

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Group Add Command")
                .setColor('fdcb58')
                .setDescription("Command user: " + message.author.username + "\nGroup Added To: " + args[2].toUpperCase() + "\nReceiver: " + data.name);
            audit_channel.send(audit_embed);

            const person_receiving = new Discord.RichEmbed()
                .setTitle("Placed in Group")
                .setColor("B721FF")
                .setDescription("You have been placed in Group " + args[2].toUpperCase());
            user.send (person_receiving);

            
        })
    }
}