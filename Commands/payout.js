module.exports = {
    name: 'payout',
    description: 'give celestial coins to all bet winners',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const fetch = require("node-fetch");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.reading_code = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json");
        const fs = require("fs");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        CLIENT.using_codes = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/using_codes.json");
        var api_key = "";
        CLIENT.saving_bets = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json");
        var found = false;

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        if (!args[1]) return message.reply ("Please specify a game.");

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function check_code() {

            for (var i in CLIENT.using_codes) {
                if (!found) {
                    var code = CLIENT.using_codes[i]["tournament_code"];
                    code = code.split("-");
                    if (args[1] === code[2]) found = true;
                }
            }
            var sampleTournament = CLIENT.using_codes[args[1]].tournament_code;

            async function fetchDataAsync1() {
                
                var sampleMatch = "https://na1.api.riotgames.com/lol/match/v4/matches/by-tournament-code/" + sampleTournament + "/ids?api_key=" + api_key;
                const response = await fetch(sampleMatch);
                if (response.status != 200) {
                    message.reply("Error Code: " + response.status);
                } else {
                    var sample_match_num = await response.json();
                    sample_match_num = sample_match_num[0];
                }
                return await sample_match_num;
            }
            fetchDataAsync1().then(sample_match_num => {
                var URL = "https://na1.api.riotgames.com/lol/match/v4/matches/" + sample_match_num + "/by-tournament-code/" + sampleTournament + "?api_key=" + api_key;
    
                async function fetchDataAsync() {
                    const response = await fetch(URL);
                    var full_match_info = await response.json();
        
                    if (full_match_info["teams"][0]["win"] === "Win") {
                        var winner = "B";
                    } else {
                        var winner = "R";
                    }

                    var count = 1;

                    for (var i in CLIENT.saving_bets[args[1]]) {
                        count += 1;
                        if (count > 3) {
                            var better = CLIENT.saving_bets[args[1]][i].split(" - ");
                            var better_second = better[1].split(" ");
                            console.log(better);
                            console.log(winner);
                            if (winner === better_second[1]) {
                                console.log(i + better[0]);
                                Data.findOne ({
                                    userID: i
                                }, (err, data) => {
                                    if (err) console.log (err);
                                    if (!data) {
                                        console.log (better[0] + " doesn't have any data");
                                    } else {
                                        console.log (better[0] + " has data");
                    
                                    }
                                })


                            } else {
                                console.log("rip " + better[0]);
                            }
                        }
                    }

                }
                fetchDataAsync();
            })

        }
        check_code();
    }
}