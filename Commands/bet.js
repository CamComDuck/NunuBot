module.exports = {
    name: 'bet',
    description: 'place a bet on a team currently playing',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        const fetch = require("node-fetch");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        CLIENT.using_codes = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/using_codes.json");
        var api_key = "RGAPI-a96b2d05-5f74-43ad-b9dc-44c12e4d0fbe";
        CLIENT.saving_bets = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json");
        const fs = require("fs");

        // #bot-commands
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }

        var error_embed = new Discord.RichEmbed()
            .setTitle("An error has occured.")
            .setColor('#d41616')
            .setFooter("If you believe this is a mistake, please message Cam Com.");

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        //+bet 85ec blue 100
        var found = false;
        var side_select = args[2][0].toUpperCase();
        var bet = args[3];

        async function check_code() {

            if (!args[1]) {
                error_embed.setDescription("Please enter the code for the game you want to bet on.\nEXAMPLE: +bet (tournament_code) (red/blue) (bet_amount)");
                return message.channel.send (error_embed);
            } else if (!args[2]) {
                error_embed.setDescription("Please enter the side you want to bet on.\nEXAMPLE: +bet (tournament_code) (red/blue) (bet_amount)");
                return message.channel.send (error_embed);
            } else if (!args[3]) {
                error_embed.setDescription("Please enter the the amount of Celestial Coins you want to bet with.\nEXAMPLE: +bet (tournament_code) (red/blue) (bet_amount)");
                return message.channel.send (error_embed);
            }

            if (side_select != "R" && side_select != "B") {
                error_embed.setDescription("You did not enter a valid side to bet on.\nValid options: Red, Blue, R, B");
                return message.channel.send(error_embed);
            }

            if (bet != Math.floor(bet)) {
                error_embed.setDescription("Please enter a whole number for your bet.");
                return message.channel.send (error_embed);
            }
            
  
            for (var i in CLIENT.using_codes) {
                if (!found) {
                    var code = CLIENT.using_codes[i]["tournament_code"];
                    code = code.split("-");
                    if (args[1] === code[2]) found = true;
                }
            }

            await sleep(1500);

            if (!found) {
                error_embed.setDescription("That game code doesn't exist");
                return message.channel.send (error_embed);
            }

            for (var o in CLIENT.saving_bets[code[2]]) {
                if (message.author.id === o) {
                    error_embed.setDescription("You can't bet on the same game again.");
                    return message.channel.send(error_embed);
                }
            }

            var sampleTournament = CLIENT.using_codes[args[1]].tournament_code;
            var sampleMatch = "https://na1.api.riotgames.com/lol/match/v4/matches/by-tournament-code/" + sampleTournament + "/ids?api_key=" + api_key;
            var response = await fetch(sampleMatch);
            if (response.status === 200) {
                error_embed.setDescription("That game is already finished.");
                return message.channel.send(error_embed);
            }
            try {
                if (CLIENT.saving_bets[code[2]]["LOCKED"] === true) {
                    error_embed.setDescription("That game has been locked. No more bets can be made.");
                    return message.channel.send(error_embed);
                }
            } catch (err) {
                var locked = false;
            }
            

            Data.findOne ({
                userID: message.author.id
            }, (err, data) => {
                if (err) console.log (err);
                if (!data) {
                    const data = new Data({
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
                    error_embed.setDescription("You don't have any Celestial Coins to bet with.");
                    return message.channel.send(error_embed);
                } else {
                    if (data.money < bet) {
                        error_embed.setDescription("You don't have enough Celestial Coins for that bet.");
                        return message.channel.send (error_embed);
                    }

                    if (data.money - bet === 0) {
                        error_embed.setDescription("You can't bet all of your Celestial Coins.");
                        return message.channel.send(error_embed);
                    }

                    data.money -= bet;
                    data.save().catch(err => console.log(err));

                    var person_name = message.author.id;
                    try {
                        var value_entries = CLIENT.saving_bets[code[2]];
                        value_entries["TOTAL"] += parseInt(args[3]);
                        value_entries[person_name] = message.author.username + " - " + args[3] + " " + side_select;
                        CLIENT.saving_bets[code[2]] = value_entries;
                    } catch (err) {
                        var value_entries = {};
                        value_entries["LOCKED"] = false;
                        value_entries["TOTAL"] = parseInt(args[3]);
                        value_entries[person_name] = message.author.username + " - " + args[3] + " " + side_select;
                        CLIENT.saving_bets[code[2]] = value_entries;
                    }
                    

                    fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json", JSON.stringify (CLIENT.saving_bets, null, 4), err => {
                        if (err) throw err;
                    })

                }
            })

            
            

            
        }
        check_code()
        
    }
}