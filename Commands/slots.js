module.exports = {
    name: 'slots',
    description: 'gamble CC on slots minigame',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }
        const audit_channel = CLIENT.channels.get('794706158476591124');
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        return message.channel.send("This command is off.");
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var emojis = [":apple:", ":apple:", ":apple:", ":grapes:", ":grapes:", ":grapes:", ":cherries:", ":cherries:", ":cherries:",
        ":cheese:", ":cheese:", ":cheese:", ":corn:", ":corn:", ":corn:", ":star:",
        ":bacon:", ":bacon:", ":bacon:", ":pizza:", ":pizza:", ":pizza:", ":doughnut:", ":doughnut:", ":doughnut:",
        ":pineapple:", ":pineapple:", ":pineapple:", ":pretzel:", ":pretzel:", ":pretzel:"]
        var pick1 = emojis[Math.floor(Math.random() * emojis.length)];
        var pick2 = emojis[Math.floor(Math.random() * emojis.length)];
        var pick3 = emojis[Math.floor(Math.random() * emojis.length)];

        Data.findOne ({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) {

                const data = new Data ({
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
                return message.reply("You don't have any Celestial Coins to play slots with.")

            } else {

                if (data.money <= 0) return message.reply ("You don't have any Celestial Coins to play slots with.");
                if (!args[1]) return message.reply ("Please specify a bet.");
                try {
                    var bet = parseFloat(args[1]);
                } catch {
                    return message.reply ("Please enter a whole number to bet.");
                }
                if (bet != Math.floor(bet)) return message.reply ("Please enter a whole number to bet.");
                if (data.money < bet) return message.reply ("You don't have enough Celestial Coins for that bet.");
                if (data.money - bet === 0) return message.reply ("You can't bet all your Celestial Coins.");
                if (bet < 1) return message.reply ("You can't bet less than 1 Celestial Coin");

                data.money -= bet;

                const slots_output = new Discord.RichEmbed()
                    .setTitle(pick1 + " | " + pick2 + " | " + pick3)
                    .setColor('78b159')
                    .setThumbnail(message.author.displayAvatarURL);

                const audit_embed = new Discord.RichEmbed()
                    .setTitle("Slots Command")
                    .setColor('78b159')
                    .addField(pick1 + " | " + pick2 + " | " + pick3, "Chosen icons");
                    

                if (pick1 === ":star:" && pick2 === ":star:" && pick3 === ":star:") {
                    data.money += bet*20;
                    data.save().catch(err => console.log(err));

                    slots_output.setDescription("Congrats on all 3 matching stars! Your bet was **multipled by 20** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                } else if ((pick1 === ":star:" && pick2 === ":star:") || (pick3 === ":star:" && pick2 === ":star:") || (pick1 === ":star:" && pick3 === ":star:")) {
                    data.money += bet*10;
                    data.save().catch(err => console.log(err));

                    slots_output.setDescription("Congrats on a star match! Your bet was **multipled by 10** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                } else if (pick1 === ":star:" || pick2 === ":star:" || pick3 === ":star:") {
                    data.money += bet*3;
                    data.save().catch(err => console.log(err));

                    slots_output.setDescription("Congrats on a star! Your bet was **tripled** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                }

                if (pick1 === pick2 && pick1 === pick3) {
                    data.money += bet*5;
                    data.save().catch(err => console.log(err));

                    slots_output.setDescription("Congrats on all 3 matching! Your bet was **quintupled** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                } else if (pick1 === pick2 || pick2 === pick3 || pick1 === pick3) {
                    data.money += bet*2;
                    data.save().catch(err => console.log(err));

                    slots_output.setDescription("Congrats on a match! Your bet was **doubled** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                } else {

                    slots_output.setDescription("You didn't get a match. Your bet was **subtracted** and you now have " + data.money + " Celestial Coins.");
                    audit_embed.setDescription("Command user: " + message.author.username + "\nMoney lost: " + bet + "\nNew balance: " + data.money);
                    data.save().catch(err => console.log(err));

                    message.channel.send(slots_output);
                    audit_channel.send(audit_embed);
                    return;

                }
            }
        })
    }
}