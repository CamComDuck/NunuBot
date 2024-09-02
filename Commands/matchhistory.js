module.exports = {
    name: 'matchhistory',
    description: 'view the match history of a player',
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
        var api_key = "";
        const fetch = require("node-fetch");
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        CLIENT.queueID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/queueID.json");
        CLIENT.summoner_spells = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/summoner_spells.json");
        var games_list = [];
        var queue_list = [];
        var champ_list = [];
        var game_count = 100;

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function fetchDataAsync() {

            if (args[1].startsWith("https://na.op.gg/summoner/userName=")) {
                        
                var summoner_name = args[1];
                summoner_name = summoner_name.substr(35);

                try {

                    var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                    var response = await fetch(URL);

                } catch (err) {

                    summoner_name = encodeURIComponent(summoner_name);

                    var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                    var response = await fetch(URL);
                }

                if (response.status === 200) {
                    var full_summ_info = await response.json();
                } else if (response.status === 429) {
                    while (response.status === 429) {
                        await sleep(1000);
                        var response = await fetch(URL);
                        if (response.status === 200) {
                            var full_summ_info = await response.json();
                        } else if (response.status != 429){
                            return console.log(response.status);
                        }
                    }
                } else if (response.status === 404) {
                    return message.reply ("Please re-enter the OP.GG for the match history to work.");
                } else {
                    return console.log(response);
                }

                message.channel.send("Starting...");

                var summonerID = full_summ_info["id"];
                var accountID = full_summ_info["accountId"];

                var URL = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerID + "?api_key=" + api_key;
                var response = await fetch(URL);
                if (response.status === 200) {
                    var champ_masteryJSON = await response.json()
                } else if (response.status === 429) {
                    while (response.status === 429) {
                        await sleep(5000);
                        var response = await fetch(URL);
                        if (response.status === 200) {
                            var champ_masteryJSON = await response.json();
                        } else if (response.status != 429){
                            return console.log(response.status);
                        }
                    }
                    
                } else {
                    return console.log ("wassup" + err);
                }
                //console.log(champ_masteryJSON);

                var URL = "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountID + "?queue=420&endIndex=" + game_count +"&api_key=" + api_key;
                var response = await fetch(URL);
                if (response.status === 200) {
                    var matchHistory = await response.json()
                } else if (response.status === 429) {
                    while (response.status === 429) {
                        await sleep(5000);
                        var response = await fetch(URL);
                        if (response.status === 200) {
                            var matchHistory = await response.json();
                        } else if (response.status != 429){
                            return console.log(response.status);
                        }
                    }
                    
                } else {
                    return console.log ("woo" + response.status);
                }
                //console.log(matchHistory["matches"]);

                

                
                for (var o = 0; o < game_count; o++) {
                    var game_ID = matchHistory["matches"][o]["queue"];
                    for (var i in CLIENT.queueID) {
                        if (game_ID === CLIENT.queueID[i]["queueId"]) {
                            if (CLIENT.queueID[i]["description"].slice(-5) === "games") {
                                var queue_name = CLIENT.queueID[i]["description"].slice(0, -6);
                            } else {
                                var queue_name = CLIENT.queueID[i]["description"];
                            }
                            queue_list.push(queue_name);
                        }
                    }
                }
                

                for (var p = 0; p < game_count; p++) {
                    var URL = "https://na1.api.riotgames.com/lol/match/v4/matches/" + matchHistory["matches"][p]["gameId"] + "?api_key=" + api_key;
                    var response = await fetch(URL);
                    if (response.status === 200) {
                        var game1 = await response.json()
                    } else if (response.status === 429 || response.status === 504) {
                        while (response.status === 429 || response.status === 504) {
                            await sleep(5000);
                            var response = await fetch(URL);
                            if (response.status === 200) {
                                var game1 = await response.json();
                            } else if (response.status != 429 && response.status != 504){
                                return console.log(response.status);
                            }
                        }
                        
                    } else {
                        return console.log (response);
                    }

                    for (var i = 0; i < 10; i++) {
                        if (game1["participantIdentities"][i]["player"]["accountId"] === accountID) var playerID = game1["participantIdentities"][i]["participantId"];
                    }
                    for (var i = 0; i < 10; i++) {
                        if (game1["participants"][i]["participantId"] === playerID) {

                            if (game1["participants"][i]["stats"]["win"] === false) {
                                var winner = "Loss";
                            } else {
                                var winner = "Win";
                            }

                            var champID = game1["participants"][i]["championId"];
                            

                            var kda = game1["participants"][i]["stats"]["kills"] + "/" + game1["participants"][i]["stats"]["deaths"] +
                            "/" + game1["participants"][i]["stats"]["assists"];

                            games_list.push(champID + "|" + winner + "|" + kda + "|" + queue_list[p])
                            //console.log(game1["participants"][i]["championId"]);
                            //champ_list.push(champ_name);
                            
                            //champ_list[p][0] = champ_name;
                        }
                    }
                    console.log(p + "/" + game_count);
                    if (p === 25) message.channel.send(p + "/" + game_count);
                    if (p === 50) message.channel.send(p + "/" + game_count);
                    if (p === 75) message.channel.send(p + "/" + game_count);

                }
                games_list.sort();
                var count_champ = 1;
                var current_champ = "";
                var current_wins = 0;
                var current_losses = 0;
                var current_kills = 0;
                var current_deaths = 0;
                var current_assists = 0;
                var split_array = []

                for (var m = 0; m < game_count; m++) {
                    
                    split_array = games_list[m].split("|");
                    split_kda = split_array[2].split("/");
                    //console.log("M: " + m + " Counter: "+ count_champ + " " + split_array);

                    if (m === 0) { // First Game

                        current_champ = split_array[0];
                        count_champ = 1;
                        current_kills += parseInt(split_kda[0]);
                        current_deaths += parseInt(split_kda[1]);
                        current_assists += parseInt(split_kda[2]);
                        if (split_array[1] === "Loss") {
                            current_losses += 1;
                        } else {
                            current_wins += 1;
                        }

                    } else if (m === (game_count-1)) { // Last Game

                        if (split_array[0] === current_champ) {
                            count_champ += 1;
                            if (split_array[1] === "Loss") {
                                current_losses += 1;
                            } else {
                                current_wins += 1;
                            }
                            current_kills += parseInt(split_kda[0]);
                            current_deaths += parseInt(split_kda[1]);
                            current_assists += parseInt(split_kda[2]);
                        } else {
                            champ_list.push(count_champ + "|" + current_champ + "|" + current_wins + "/" + current_losses + "|" + current_kills +
                            "/" + current_deaths + "/" + current_assists);

                            current_champ = split_array[0];
                            count_champ = 1;
                            current_kills = parseInt(split_kda[0]);
                            current_deaths = parseInt(split_kda[1]);
                            current_assists = parseInt(split_kda[2]);
                            if (split_array[1] === "Loss") {
                                current_losses = 1;
                                current_wins = 0;
                            } else {
                                current_wins = 1;
                                current_losses = 0;
                            }
                        }
                        
                        champ_list.push(count_champ + "|" + current_champ + "|" + current_wins + "/" + current_losses + "|" + current_kills +
                        "/" + current_deaths + "/" + current_assists);

                    } else if (split_array[0] === current_champ) { // Matching champ

                        count_champ += 1;
                        current_kills += parseInt(split_kda[0]);
                        current_deaths += parseInt(split_kda[1]);
                        current_assists += parseInt(split_kda[2]);
                        if (split_array[1] === "Loss") {
                            current_losses += 1;
                        } else {
                            current_wins += 1;
                        }

                    } else { // Not matching champ

                        champ_list.push(count_champ + "|" + current_champ + "|" + current_wins + "/" + current_losses + "|" + current_kills +
                        "/" + current_deaths + "/" + current_assists);
                        current_champ = split_array[0];
                        count_champ = 1;
                        current_kills = parseInt(split_kda[0]);
                        current_deaths = parseInt(split_kda[1]);
                        current_assists = parseInt(split_kda[2]);
                        if (split_array[1] === "Loss") {
                            current_losses = 1;
                            current_wins = 0;
                        } else {
                            current_wins = 1;
                            current_losses = 0;
                        }

                    }

                }
                
                var champs_back = [];

                for (var j = 0; j < champ_list.length; j++) {

                    var champs_split = champ_list[j].split("|");

                    for (var h in CLIENT.championsID) {
                        
                        if (h === champs_split[1]) {
                            
                            for (var g = 0; g < champ_masteryJSON.length; g++) {

                                if (champ_masteryJSON[g]["championId"] === parseInt(h)){
                                    var champ_mastery = champ_masteryJSON[g]["championPoints"];
                                    if (champ_mastery > 999999) champ_mastery = champ_mastery.toString()[0] + "." + champ_mastery.toString()[1] + "M Mastery";
                                    if (champ_mastery > 999) champ_mastery = champ_mastery.toString().slice(0, -3) + "K Mastery";
                                    champs_split[4] = champ_mastery;
                                }
                                
                            }

                        }
                        
                    }

                    

                    var champ_name = CLIENT.championsID[champs_split[1]].name;
                    if (champ_name === "MonkeyKing") champ_name = "Wukong";
                    champs_split[1] = champ_name;
                    var win_loss_split = champs_split[2].split("/");
                    var win_loss = Math.floor(parseInt(win_loss_split[0])/(parseInt(win_loss_split[0])+parseInt(win_loss_split[1]))*100) + "% (" + win_loss_split[0] + "-" + win_loss_split[1] + ")";
                    champs_split[2] = win_loss;
                    var kda_split = champs_split[3].split("/");
                    var total_games = parseInt(champs_split[0]);
                    var avg_kda = (parseInt(kda_split[0])/total_games).toFixed(2) + "/" + (parseInt(kda_split[1])/total_games).toFixed(2) + "/" + (parseInt(kda_split[2])/total_games).toFixed(2)
                    champs_split[3] = avg_kda;
                    champs_back.push(champs_split[0] + " | " + champs_split[1] + " | " + champs_split[2] + " | " + champs_split[3] + " | " + champs_split[4]);

                    

                }

                champs_back.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[4]) - parseInt(a.split("|")[4]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                message.channel.send("Champions Recently Played: " + summoner_name);

                for (var i = 0; i < champs_back.length; i++) {
                    var champs_back_split = champs_back[i].split("|");
                    if (champs_back_split[0] != 1) {
                        message.channel.send(champs_back[i]);
                    }
                    
                }


                
                /*

                console.log(games_list);
                console.log("");
                champ_list.sort();
                console.log(champ_list);


                /*

                var userprofile = new Discord.RichEmbed()
                    .setTitle("Match History")
                    .setColor('#B721FF')
                    .addField("History 1", games_list.slice(0, 10))
                    //.addField("History 1", games_list.slice(25, 50));
                message.channel.send(userprofile);
                */


            } else {
                return message.reply ("You didn't enter an OP.GG link.");
            }
            

        }

        fetchDataAsync();
    }
}