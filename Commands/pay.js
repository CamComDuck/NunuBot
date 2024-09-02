module.exports = {
    name: 'pay',
    description: 'allows people to pay CC to another person',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const Discord = require('discord.js');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }
        let user = message.mentions.users.first() || CLIENT.users.get(args[1])
        if (!user) return message.reply ("Sorry, couldn't find that user.");
        if (!args[2]) return message.reply ("Please specify the amount you want to pay.");
        if (user.id === message.author.id) return message.reply ("You can't pay yourself!");

        Data.findOne ({
            userID: message.author.id
        }, (err, authorData) => {

            if (err) console.log (err);
            if (!authorData) {

                return message.reply("You don't have any Celestial Coins to pay.");

            } else {

                Data.findOne ({
                    userID: user.id
                }, (err, userData) => {
                    if (err) console.log(err);
                    if (!userData) {

                        var userData = new Data ({
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

                        

                    }

                    if (parseInt(args[2]) > authorData.money) return message.reply ("You don't have enough money to make that payment");
                    if (parseInt(args[2]) < 1) return message.reply ("You can't give less than 1 Celestial Coin");

                    userData.money += parseInt(args[2]);
                    authorData.money -= parseInt(args[2]);
                    userData.save().catch(err => console.log(err));
                    authorData.save().catch(err => console.log(err));

                    const audit_embed = new Discord.RichEmbed()
                        .setTitle("Pay Command")
                        .setColor('fdcb58')
                        .setDescription("Command user: " + message.author.username + "\nMoney given: " + args[2] + "\nReceiver: " + userData.name + "\nNew balance: " + userData.money);
                    audit_channel.send(audit_embed);

                    const person_receiving = new Discord.RichEmbed()
                        .setTitle("Received Celestial Coins")
                        .setColor("B721FF")
                        .setDescription("You received " + args[2] + " Celestial Coins from " + message.author.username + ". You now have " + userData.money + " Celestial Coins.");
                    user.send (person_receiving);

                    message.channel.send ("Payment of " + args[2] + " Celestial Coins has been made to " + userData.name + " from " + message.author.username + " who now has " + authorData.money +
                    " Celestial Coins.");

                })

                

            }

            
        })
    }
}