module.exports = {
    name: 'displaygame',
    description: 'displays a game to bet on',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        const fetch = require("node-fetch");
        const fs = require("fs");
        var api_key = "";
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        CLIENT.summoner_spells = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/summoner_spells.json");
        CLIENT.saving_bets = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        let user = message.mentions.users.first() || CLIENT.users.get(args[1])
        if (!user) return message.reply ("Sorry, couldn't find that user.");

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
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
                    group: 0
                })

                data.save().catch(err => console.log(err));
                return message.reply ("That user doesn't have their op.gg saved");

            } else {

                async function check_code() {
                    if (data.opgg.startsWith("https://na.op.gg/summoner/userName=")) {
                        summoner_name = data.opgg.substr(35);

                        var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                        var response = await fetch(URL);

                        if (response.status === 200) {
                            var full_summ_info = await response.json();
                        } else if (response.status === 429) {
                            while (response.status === 429) {
                                await sleep(90000);
                                var response = await fetch(URL);
                                if (response.status === 200) {
                                    var full_summ_info = await response.json();
                                } else if (response.status != 429){
                                    return console.log(response.status);
                                }
                            }
                        } else {
                            console.log("hi" + err);
                        }
                        var summonerID = full_summ_info["id"];
                        var URL = "https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerID + "?api_key=" + api_key;
                        var response = await fetch(URL);

                        if (response.status === 200) {
                            var clash_test = await response.json()
                        } else if (response.status === 429) {
                            while (response.status === 429) {
                                await sleep(5000);
                                var response = await fetch(URL);
                                if (response.status === 200) {
                                    var clash_test = await response.json();
                                } else if (response.status != 429){
                                    return console.log(response.status);
                                }
                            }
                            
                        } else if (response.status === 404) {
                            return message.reply ("That user is not currently in a game.");
                        } else {
                            return console.log ("hiiii" + err + response.status);
                        }

                        try {
                            var participant_list = Object.entries(clash_test.participants);
                        } catch (err) {
                            console.log(err);
                            return;
                        }

                        var game_length = clash_test["gameLength"]
                        var game_mins = Math.floor(game_length/60);
                        var game_secs = game_length-(game_mins*60);

                        var info_tb_saved = [];

                        for (var i = 0; i < 10; i++) {
                            var playing_champID = participant_list[i][1]["championId"];
                            var playing_champNAME = CLIENT.championsID[playing_champID].name;
                            var used_spellID1 = participant_list[i][1]["spell1Id"];
                            var used_spell_name1 = CLIENT.summoner_spells[used_spellID1].name;
                            var used_spellID2 = participant_list[i][1]["spell2Id"];
                            var used_spell_name2 = CLIENT.summoner_spells[used_spellID2].name;
                            info_tb_saved.push(participant_list[i][1]["summonerName"] + " | " + playing_champNAME + "  " + used_spell_name1 + " " + used_spell_name2);
                        }

                        await sleep (2000);
                        //console.log(info_tb_saved);

                        const game_embed = new Discord.RichEmbed()
                        .setTitle("Game In Progress " + game_mins + ":" + game_secs)
                        .setColor('0318fc')
                        .addField("Blue Team",
                            info_tb_saved[0] + "\n" +
                            info_tb_saved[1] + "\n" +
                            info_tb_saved[2] + "\n" +
                            info_tb_saved[3] + "\n" +
                            info_tb_saved[4] + "\n", true)
                        .addField("Red Team",
                            info_tb_saved[5] + "\n" +
                            info_tb_saved[6] + "\n" +
                            info_tb_saved[7] + "\n" +
                            info_tb_saved[8] + "\n" +
                            info_tb_saved[9] + "\n", true);
                        message.channel.send (game_embed);
                        //console.log(participant_list);


                    } else {
                        return message.reply ("That user doesn't have their op.gg saved");
                    }

                }
                check_code();
            }
        }) 
    }
}