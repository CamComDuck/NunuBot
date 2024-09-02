module.exports = {
    name: 'group',
    description: 'display all competitors in a group',
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

        // #bot-commands
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }

        var group_letter = args[1].toLowerCase();

        if (group_letter != "a" && group_letter != "b" && group_letter != "c" && group_letter != "d" && group_letter != "e") {
            return message.reply ("That is not a valid group letter.");
        }

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

        Data.find({
            group: group_number
        }).sort([
            ['wins', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);

            var page = Math.ceil(res.length / 10);
            var pg = parseInt(args[1]);
            if (pg != Math.floor(pg) || !pg) pg = 1;
            let end = pg * 10;
            let start = (pg * 10) - 10;

            const embed = new Discord.RichEmbed()
                .setTitle("Group " + args[1].toUpperCase())
                .setColor('#F3DA7D');

            if (res.length === 0) {
                embed.addField ("Error", "No pages found");
            } else if (res.length <= start) {
                embed.addField ("Error", "Page not found");
            } else if (res.length <= end) {
                embed.setFooter("Page " + pg + " of " + page);

                for (i = start; i < res.length; i++) {
                    embed.addField(`${res[i].name}`, `${res[i].rank.toLocaleString()}\n${res[i].role.toLocaleString()}\n${res[i].opgg.toLocaleString()}`);
                }
            } else {
                embed.setFooter("Page " + pg + " of " + page);

                for (i = start; i < end; i++) {
                    embed.addField(`${res[i].name}`, `${res[i].rank.toLocaleString()}\n${res[i].role.toLocaleString()}\n${res[i].opgg.toLocaleString()}`);
                }
            }

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Group View Command")
                .setColor('#aa8ed6')
                .setDescription("Command user: " + message.author.username + "\nGroup viewed: " + args[1].toUpperCase());
            audit_channel.send(audit_embed);
            
            message.channel.send(embed);

        })
    }
}