module.exports = {
    name: 'leaderboard',
    description: 'view the CC leaderboard',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js')
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json")
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }
            
        Data.find({
            lb: "all"
        }).sort([
            ['money', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);

            var page = Math.ceil(res.length / 10);
            var pg = parseInt(args[1]);
            if (pg != Math.floor(pg) || !pg) pg = 1;
            let end = pg * 10;
            let start = (pg * 10) - 10;

            const embed = new Discord.RichEmbed()
                .setTitle("Celestial Coins Leaderboard")
                .setColor('#F3DA7D')
                .setThumbnail("https://cdn.discordapp.com/attachments/793325534355390464/795714887325450300/Celestial_Coin.png");

            if (res.length === 0) {
                embed.addField ("Error", "No pages found");
            } else if (res.length <= start) {
                embed.addField ("Error", "Page not found");
            } else if (res.length <= end) {
                embed.setFooter("Page " + pg + " of " + page);

                for (i = start; i < res.length; i++) {
                    embed.addField(`${i+1}. ${res[i].name}`, `${res[i].money.toLocaleString()} Celestial Coins`);
                }
            } else {
                embed.setFooter("Page " + pg + " of " + page);

                for (i = start; i < end; i++) {
                    embed.addField(`${i+1}. ${res[i].name}`, `${res[i].money.toLocaleString()} Celestial Coins`);
                }
            }

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Leaderboard Command")
                .setColor('#aa8ed6')
                .setDescription("Command user: " + message.author.username);
            audit_channel.send(audit_embed);
            
            message.channel.send(embed);

        })
    }
}