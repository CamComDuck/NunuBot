module.exports = {
    name: 'profile',
    description: 'view the profile of a user',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js')
        const mongoose = require("mongoose");
        const audit_channel = message.client.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        const Canvas = require ("canvas");
        var api_key = "";
        const fetch = require("node-fetch");
        const fs = require("fs");
        // if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
        //     return message.reply ("This is not the correct channel for bot commands.");
        // }
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var profilerank = "All ranks are updated each night";
        var profilerole = "Enter your role with +profile (role)";
        var profileopgg = "Enter your OP.GG with +profile (opgg)";
        var error_embed = new Discord.RichEmbed()
            .setTitle("An error has occured.")
            .setDescription("You didn't enter a valid option.")
            .addField("Role Options", "> Top\n> Jungle\n> Mid\n> ADC\n> Support\n> Fill", true)
            .addField("OP.GG Link", "Must start with 'https://na.op.gg/summoner/userName='")
            .setColor('#d41616')
            .setFooter("If you believe this is a mistake, please message Cam Com.");

        var roles = ["top", "jungle", "mid", "adc", "support", "fill"];
        
        if (!args[1]) {
            var changer = "Not Needed";
        } else {
            var changer = args[1].toLowerCase();
        }

        
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // { Make an api call to Riot server
        async function api_call(url) {
            var url2 = url;
            var response = await fetch(url2);
            if (response.status === 200) {
                var output = await response.json();
                return output;
            } else if (response.status === 429 || response.status === 504) {
                while (response.status === 429 || response.status === 504) {
                    sleep(1000);
                    var response = await fetch(url2);
                    if (response.status === 200) {
                        var output = await response.json();
                        return output;
                    } else if (response.status != 429 && response.status != 504){
                        console.log("In Loop Error: " + response.status);
                        return "Error";
                    }
                }
            } else {
                console.log ("Out of Loop Error: " + response.status);
                return "Error";
            }
        }
        // }


        if (!args[1]) {
            var user = message.author;
            changer = "Not Needed";
        } else if (args[1].startsWith("<@")) {
            var user = message.mentions.users.first() || CLIENT.users.cache.get(args[1]);
            changer = "Not Needed";
        } else {


            for (var o = 0; o < roles.length; o++) {
                if (changer === roles[o]) {
                    var user = message.author;
                    profilerole = changer[0].toUpperCase() + changer.slice(1).toLowerCase();
                    changer = "changed";
                }
            }


            if (args[1].startsWith("https://na.op.gg/summoner/userName=")) {
                var user = message.author;    
                
                var summoner_name = args[1];
                summoner_name = summoner_name.substr(35);

                // var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                // var response = await fetch(URL);
                // var full_summ_info = await response.json();
                // var summonerID = full_summ_info["id"];
                // var URL = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerID + "?api_key=" + api_key;
                // var response = await fetch(URL);
                // var ranked_summ_info = await response.json()
                
                // try {
                //     var current_rank = ranked_summ_info[0]["tier"] + " " + ranked_summ_info[0]["rank"];
                // } catch (err) {
                //     var current_rank = "UNRANKED";
                // }
                
                profileopgg = args[1];
                changer = "changed";
            }


            if (changer != "changed") {
                return message.channel.send(error_embed);
            }

        }



        Data.findOne ({
            userID: user.id
        }, (err, data) => {
            if (err) console.log (err);
            if (!data) {
                var data = new Data({
                    name: user.username,
                    userID: user.id,
                    lb: "all",
                    money: 0,
                    warns: 0,
                    rank: profilerank,
                    role: profilerole,
                    opgg: profileopgg,
                    wins: 0,
                    losses: 0,
                    registered: false,
                    streak: 0,
                    onstreak: false,
                    group: 0
                })
            } else if (changer != "Not Needed"){
                if (profilerole != "Enter your role with +profile (role)") {
                    data.role = profilerole;
                } else if (profileopgg != "Enter your role with +profile (opgg)") {
                    data.opgg = profileopgg;
                }
            }
            data.name = user.username;
            data.save().catch(err => console.log(err));
            if (data.opgg != "Enter your OP.GG with +profile (opgg)") {
                
                var summoner_name = data.opgg;

                async function fetchDataAsync() {

                    if (summoner_name.startsWith("https://na.op.gg/summoner/userName=")) {

                        try {
                            
                            summoner_name = summoner_name.substr(35);

                            var full_summ_info = await api_call("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key);

                        } catch (err) {

                            summoner_name = encodeURIComponent(summoner_name);

                            var full_summ_info = await api_call("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key);
                        }

                        var summonerID = full_summ_info["id"];
                        var accountID = full_summ_info["accountId"];
                        var summonerPUUID = full_summ_info["puuid"];
                        var summonerName = full_summ_info["name"];
                        
                        var champ_masteryJSON = await api_call("https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerID + "?api_key=" + api_key);
                        var full_mh = await api_call("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + summonerPUUID + "/ids?queue=420&count=50&api_key=" + api_key);
                        var ranked_summ_info = await api_call("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerID + "?api_key=" + api_key);

                        var top_count = 0;
                        var jg_count = 0;
                        var mid_count = 0;
                        var adc_count = 0;
                        var supp_count = 0;
                        /*
                        for (var p = 0; p < full_mh.length; p++) { // Create arrays
                            var url_current_game = "https://americas.api.riotgames.com/lol/match/v5/matches/"+ full_mh[p] + "?api_key=" + api_key;
                            var current_game = await api_call(url_current_game);
                            if (current_game != "Error") {
                      
                              for (var i = 0; i < 10; i++) {
                                if (current_game["info"]["participants"][i]["summonerId"] === summonerID) {
                                  var playerID = current_game["info"]["participants"][i]["participantId"];
                                } 
                              }
                      
                              for (var i = 0; i < 10; i++) {
                                if (current_game["info"]["participants"][i]["participantId"] === playerID) {
                      
                                  if (current_game["info"]["participants"][i]["individualPosition"] === "TOP") {
                                    top_count++;
                                  } else if (current_game["info"]["participants"][i]["individualPosition"] === "JUNGLE") {
                                    jg_count++;
                                  } else if (current_game["info"]["participants"][i]["individualPosition"] === "MIDDLE") {
                                    mid_count++;
                                  } else if (current_game["info"]["participants"][i]["individualPosition"] === "BOTTOM") {
                                    adc_count++;
                                  } else if (current_game["info"]["participants"][i]["individualPosition"] === "UTILITY") {
                                    supp_count++;
                                  }

                                }
                              }
                            } else {
                              game_count = game_count - 1;
                            }
                            
                        }
                        */

                        // console.log ("Top: " + top_count + " Jungle: " + jg_count + " Mid: " + mid_count + " ADC: " + adc_count + " Support: " + supp_count);
                        
                        var mastery_array = []
                        for (var u = 0; u < 8; u++) {
                            var champID = champ_masteryJSON[u]["championId"];
                            var champ_name = CLIENT.championsID[champID].name;
                            var champ_mastery = champ_masteryJSON[u]["championPoints"];
                            if (champ_name === "MonkeyKing") champ_name = "Wukong";
                            if (champ_mastery > 999999) champ_mastery = champ_mastery.toString()[0] + "." + champ_mastery.toString()[1] + "M";
                            if (champ_mastery > 999) champ_mastery = champ_mastery.toString().slice(0, -3) + "K";
                            
                            mastery_array.push(champ_name);
                            mastery_array.push(champ_mastery);
                        }
                        

                        try {
                            
                            if (ranked_summ_info[0]["queueType"] === 'RANKED_SOLO_5x5') {
                                var current_soloq_rank = ranked_summ_info[0]["tier"] + " " + ranked_summ_info[0]["rank"];
                                var soloq_wins = ranked_summ_info[0]["wins"];
                                var soloq_losses = ranked_summ_info[0]["losses"];
                            } else if (ranked_summ_info[1]["queueType"] === 'RANKED_SOLO_5x5') {
                                var current_soloq_rank = ranked_summ_info[1]["tier"] + " " + ranked_summ_info[1]["rank"];
                                var soloq_wins = ranked_summ_info[1]["wins"];
                                var soloq_losses = ranked_summ_info[1]["losses"];
                            } else if (ranked_summ_info[2]["queueType"] === 'RANKED_SOLO_5x5') {
                                var current_soloq_rank = ranked_summ_info[2]["tier"] + " " + ranked_summ_info[2]["rank"];
                                var soloq_wins = ranked_summ_info[2]["wins"];
                                var soloq_losses = ranked_summ_info[2]["losses"];
                            }
                            
                        } catch (err) {
                            var current_soloq_rank = "UNRANKED";
                            var soloq_wins = 0
                            var soloq_losses = 0;
                        }

                        try {
                            
                            if (ranked_summ_info[0]["queueType"] === 'RANKED_FLEX_SR') {
                                var current_flex_rank = ranked_summ_info[0]["tier"] + " " + ranked_summ_info[0]["rank"];
                                var flex_wins = ranked_summ_info[0]["wins"];
                                var flex_losses = ranked_summ_info[0]["losses"];
                            } else if (ranked_summ_info[1]["queueType"] === 'RANKED_FLEX_SR') {
                                var current_flex_rank = ranked_summ_info[1]["tier"] + " " + ranked_summ_info[1]["rank"];
                                var flex_wins = ranked_summ_info[1]["wins"];
                                var flex_losses = ranked_summ_info[1]["losses"];
                            } else if (ranked_summ_info[2]["queueType"] === 'RANKED_FLEX_SR') {
                                var current_flex_rank = ranked_summ_info[2]["tier"] + " " + ranked_summ_info[2]["rank"];
                                var flex_wins = ranked_summ_info[2]["wins"];
                                var flex_losses = ranked_summ_info[2]["losses"];
                            }
                            
                        } catch (err) {
                            var current_flex_rank = "UNRANKED";
                            var flex_wins = 0;
                            var flex_losses = 0;
                        }

                        
                        
                        
                        //console.log(ranked_summ_info);
                        //console.log(current_rank);
                        data.rank = current_soloq_rank;
                        data.save().catch(err => console.log(err));

                        if (data.wins === 0 && data.losses === 0) {
                            var win_ratio = "None (0-0)";
                        } else if (data.wins > 0 && data.losses === 0) {
                            var win_ratio = "100% (" + data.wins + "-0)";
                        } else if (data.wins === 0 && data.losses > 0) {
                            var win_ratio = "0% (0-" + data.losses + ")";
                        } else {
                            var win_ratio = Math.floor((data.wins/(data.wins+data.losses))*100) + "% (" + data.wins + "-" + data.losses + ")";
                        }
            
                        if (soloq_wins === 0 && soloq_losses === 0) {
                            var soloq_win_ratio = "None (0-0)";
                        } else if (soloq_wins > 0 && soloq_losses === 0) {
                            var soloq_win_ratio = "100% (" + soloq_wins + "-0)";
                        } else if (soloq_wins === 0 && soloq_losses > 0) {
                            var soloq_win_ratio = "0% (0-" + soloq_losses + ")";
                        } else {
                            var soloq_win_ratio = Math.floor((soloq_wins/(soloq_wins+soloq_losses))*100) + "% (" + soloq_wins + "-" + soloq_losses + ")";
                        }
            
                        if (flex_wins === 0 && flex_losses === 0) {
                            var flex_win_ratio = "None (0-0)";
                        } else if (flex_wins > 0 && flex_losses === 0) {
                            var flex_win_ratio = "100% (" + flex_wins + "-0)";
                        } else if (flex_wins === 0 && flex_losses > 0) {
                            var flex_win_ratio = "0% (0-" + flex_losses + ")";
                        } else {
                            var flex_win_ratio = Math.floor((flex_wins/(flex_wins+flex_losses))*100) + "% (" + flex_wins + "-" + flex_losses + ")";
                        }
            
                        
                        var userprofile = new Discord.RichEmbed()
                            .setTitle(user.username)
                            .setColor('#B721FF')
                            .setDescription(
                            //"Balance: " + data.money + " Celestial Coins\nTournament WR: " + win_ratio +
                            //"\nCurrent Participation Streak: " + data.streak + " tournaments\n" +
                            "OP.GG Link: " + data.opgg + 
                            //"\nRoles Played: Top: " + top_count + " Jungle: " + jg_count + " Mid: " + mid_count + " ADC: " + adc_count + " Support: " + supp_count +
                            "\nMain Role: " + data.role)
                            .addField("League Ranked", "Solo/Duo Rank ``" + current_soloq_rank +
                            "``\nSolo/Duo WR ``" + soloq_win_ratio +
                            "``\nFlex Rank ``" + current_flex_rank +
                            "``\nFlex WR ``" + flex_win_ratio + "``", true)
                            .addField("Champion Mastery", mastery_array[0] + " ``" + mastery_array[1] + "`` | " + mastery_array[2] + " ``" + mastery_array[3] +
                            "``\n" + mastery_array[4] + " ``" + mastery_array[5] + "`` | " + mastery_array[6] + " ``" + mastery_array[7] +
                            "``\n" + mastery_array[8] + " ``" + mastery_array[9] + "`` | " + mastery_array[10] + " ``" + mastery_array[11] +
                            "\n``" + mastery_array[12] + " ``" + mastery_array[13] + "`` | " + mastery_array[14] + " ``" + mastery_array[15] + "``", true)
                            //.setFooter(data.warns + " Warnings")
                            .setThumbnail(user.displayAvatarURL);
                        message.channel.send(userprofile);
                        
                        

                        //"Top: " + top_count + " Jungle: " + jg_count + " Mid: " + mid_count + " ADC: " + adc_count + " Support: " + supp_count + " Fill: " + fill_count

                        const audit_embed = new Discord.RichEmbed()
                            .setTitle("Profile Command")
                            .setColor('aa8ed6')
                            .setDescription("Command user: " + message.author.username + "\nUser viewed: " + user.username);
                        audit_channel.send(audit_embed);
                    }

                }

                fetchDataAsync();

            } else {
                var userprofile = new Discord.RichEmbed()
                    .setTitle(user.username)
                    .setColor('#B721FF')
                    .setDescription(
                        //"Balance: " + data.money + " Celestial Coins\nCurrent Participation Streak: " + data.streak + " tournaments\n" +
                        "OP.GG Link: " + data.opgg + "\nMain Role: " + data.role)
                    .addField("League", "Add your OP.GG for player Info")
                    //.setFooter(data.warns + " Warnings")
                    .setThumbnail(user.displayAvatarURL);
                message.channel.send(userprofile);
            }

            
        })
    }
}