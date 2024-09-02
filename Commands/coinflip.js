module.exports = {
    name: 'coinflip',
    description: 'gamble away CC with a coinflip',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var pick = Math.floor(Math.random() * 100);
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }

        return message.channel.send("This command is off.");

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
                return message.reply("You don't have any Celestial Coins to coinflip with.")

            } else {

                if (data.money <= 0) return message.reply ("You don't have any to coinflip.");
                
                if (!args[1]) return message.reply ("Please specify a bet.");
                if (args[1].toLowerCase() == "all") args[1] = data.money;
                try {
                    var bet = parseFloat(args[1]);
                } catch {
                    return message.reply ("Please enter a whole number to bet.");
                }
                if (bet < 1) return message.reply ("You can't bet less than 1 Celestial Coin");
                if (bet != Math.floor(bet)) return message.reply ("Please enter a whole number to bet.");
                if (data.money < bet) return message.reply ("You don't have enough money for that bet.");
                if (data.money - bet === 0) return message.reply ("You can't bet all your Celestial Coins.");
        
                if (pick <= 51) {
                    data.money -= bet;
                    data.save().catch(err => console.log(err));
                    
                    const audit_embed_loss = new Discord.RichEmbed()
                        .setTitle("Coinflip Command")
                        .setColor('B721FF')
                        .setDescription("Command user: " + message.author.username + "\nMoney lost: " + bet + "\nNew balance: " + data.money);
                    audit_channel.send(audit_embed_loss);
    
                    const person_receiving_loss = new Discord.RichEmbed()
                        .setTitle("Lost Coinflip")
                        .setColor("B721FF")
                        .setDescription("You lost your bet of " + bet + " Celestial Coins. You now have " + data.money + " Celestial Coins.")
                        .setThumbnail(message.author.displayAvatarURL);
                    message.channel.send (person_receiving_loss);

                } else {
                    data.money += bet;
                    data.save().catch(err => console.log(err));
                    
                    const audit_embed_win = new Discord.RichEmbed()
                        .setTitle("Coinflip Command")
                        .setColor('78b159')
                        .setDescription("Command user: " + message.author.username + "\nMoney won: " + bet + "\nNew balance: " + data.money);
                    audit_channel.send(audit_embed_win);

                    const person_receiving_win = new Discord.RichEmbed()
                        .setTitle("Won Coinflip")
                        .setColor("78b159")
                        .setDescription("You won your bet of " + bet + " Celestial Coins. You now have " + data.money + " Celestial Coins.")
                        .setThumbnail(message.author.displayAvatarURL);
                    message.channel.send (person_receiving_win);

                }
            }
        })
    }
}