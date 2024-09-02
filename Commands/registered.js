module.exports = {
    name: 'registered',
    description: 'view all registered players',
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

        var top_count = 0;
        var jg_count = 0;
        var mid_count = 0;
        var adc_count = 0;
        var supp_count = 0;
        var fill_count = 0;
        var total_count = 0;

        var unranked_count = 0;
        var iron_count = 0;
        var bronze_count = 0;
        var silver_count = 0;
        var gold_count = 0;
        var plat_count = 0;
        var diamond_count = 0;
        var master_count = 0;
        var gm_count = 0;
        var chall_count = 0;

        // if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
        //     return message.reply ("This is not the correct channel for bot commands.");
        // }
            
        Data.find({
            registered: true
        }).sort([
            ['money', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);

            var page = Math.ceil(res.length / 9);
            var pg = parseInt(args[1]);
            if (pg != Math.floor(pg) || !pg) pg = 1;
            let end = pg * 9;
            let start = (pg * 9) - 9;

            if (res.length > 0) {

                for (i = 0; i < res.length; i++) {

                    var player_rank = res[i].rank.split(" ")

                    switch (res[i].role) {
                        case "Top":
                            top_count += 1;
                            break;
    
                        case "Jungle":
                            jg_count += 1;
                            break;
    
                        case "Mid":
                            mid_count += 1;
                            break;
    
                        case "Adc":
                            adc_count += 1;
                            break;
    
                        case "Support":
                            supp_count += 1;
                            break;
    
                        case "Fill":
                            fill_count += 1;
                            break;
                    }

                    switch (player_rank[0]) {
                        case "UNRANKED":
                            unranked_count += 1;
                            break;

                        case "IRON":
                            iron_count += 1;
                            break;

                        case "BRONZE":
                            bronze_count += 1;
                            break;

                        case "SILVER":
                            silver_count += 1;
                            break;

                        case "GOLD":
                            gold_count += 1;
                            break;

                        case "PLATINUM":
                            plat_count += 1;
                            break;

                        case "DIAMOND":
                            diamond_count += 1;
                            break;

                        case "MASTER":
                            master_count += 1;
                            break;

                        case "GRANDMASTER":
                            gm_count += 1;
                            break;

                        case "CHALLENGER":
                            chall_count += 1;
                            break;

                    }

                    total_count += 1;
                    
                }

            }

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function fetchDataAsync() {

                if (i < res.length) await sleep(200);

                const embed = new Discord.RichEmbed()
                    .setTitle("Registered Members - " + total_count + " Total")
                    .setDescription("**Role Count:** Top: " + top_count + " | Jungle: " + jg_count + " | Mid: " +
                    mid_count + " | ADC: " + adc_count + " | Support: " + supp_count + " | Fill: " + fill_count +
                    "\n**Rank Count:** Unranked: " + unranked_count + " | Iron: " + iron_count + " | Bronze: " + bronze_count +
                    " | Silver: " + silver_count + "\nGold: " + gold_count + " | Plat: " + plat_count + " | Diamond: " + diamond_count +
                    " | Master: " + master_count + " | GM: " + gm_count + " | Chall: " + chall_count)
                    .setColor('#F3DA7D');

                if (res.length === 0) {

                    embed.addField ("Error", "No pages found");

                } else if (res.length <= start) {

                    embed.addField ("Error", "Page not found");

                } else if (res.length <= end) {

                    embed.setFooter("Page " + pg + " of " + page);

                    for (i = start; i < res.length; i++) {
                        embed.addField(`${res[i].name}`, `${res[i].rank.toLocaleString()}\n${res[i].role.toLocaleString()}\n${res[i].opgg.toLocaleString()}`, true);
                    }

                } else {

                    embed.setFooter("Page " + pg + " of " + page);

                    for (i = start; i < end; i++) {
                        embed.addField(`${res[i].name}`, `${res[i].rank.toLocaleString()}\n${res[i].role.toLocaleString()}\n${res[i].opgg.toLocaleString()}`, true);
                    }

                }

                const audit_embed = new Discord.RichEmbed()
                    .setTitle("Registered View Command")
                    .setColor('#aa8ed6')
                    .setDescription("Command user: " + message.author.username);
                audit_channel.send(audit_embed);
                
                message.channel.send(embed);

            }

            fetchDataAsync();

        })
    }
}