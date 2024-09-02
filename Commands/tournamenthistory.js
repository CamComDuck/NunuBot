module.exports = {
    name: 'tournamenthistory',
    description: 'mvp and stats command for tournament codes',
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
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        CLIENT.tt_codes = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/tt_codes.json");
        CLIENT.tt_info = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/tt_info.json");
        CLIENT.item_names = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/item_names.json");
        const fs = require("fs");
        const fetch = require("node-fetch");
        var api_key = "";
        var game_list = [];
        var champ_list = [];
        var fb_list = [];
        var kills_list = [];
        var deaths_list = [];
        var assists_list = [];
        var vision_list = [];
        var damage_list = [];
        var cs_list = [];
        var item_list = [];
        
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function readCodes() {
            
            for (var i in CLIENT.tt_codes) {
                console.log(i);

                // CREATE TOURNAMENT ID

                var code_real = true;

                

                var current_tc = CLIENT.tt_codes[i];
                var match_num_url = "https://na1.api.riotgames.com/lol/match/v4/matches/by-tournament-code/" + current_tc + "/ids?api_key=" + api_key;
                var match_num_response = await fetch(match_num_url);
                if (match_num_response.status != 200 && match_num_response.status != 404 && match_num_response.status != 429 && match_num_response.status != 504) {
                    return message.reply("Error Code Tournament ID: " + match_num_response.status + " - " + match_num_response.statusText);
                } else if (match_num_response.status === 429 || match_num_response.status === 504) {
                    while (match_num_response.status === 429 || match_num_response.status === 504) {
                        console.log(match_num_response.status);
                        await sleep(1000);
                        var match_num_response = await fetch(match_num_url);
                        if (match_num_response.status === 200) {
                            var current_tc_info = await match_num_response.json();
                        } else if (match_num_response.status === 404) {
                            code_real = false;
                        } else if (match_num_response.status != 429 && match_num_response.status != 504){
                            return console.log("Error Code Tournament ID 2: "+ match_num_response.status);
                        } 
                    }
                } else if (match_num_response.status === 404) {
                    code_real = false;
                } else {
                    var match_num = await match_num_response.json();
                    match_num = match_num[0];
                    
                }

                if (code_real) {

                    // READ TOURNAMENT CODE
                    
                    var tc_URL = "https://na1.api.riotgames.com/lol/match/v4/matches/" + match_num + "/by-tournament-code/" + current_tc + "?api_key=" + api_key;
                    var tc_response = await fetch(tc_URL);
                    if (tc_response.status != 200 && tc_response.status != 404 && tc_response.status != 429 && tc_response.status != 504) {
                        return message.reply("Error Code Tournament Code Read: " + tc_response.status + " - " + tc_response.statusText + " - " + match_num);
                    } else if (tc_response.status === 429 || tc_response.status === 504) {
                        while (tc_response.status === 429 || tc_response.status === 504) {
                            console.log(tc_response.status);
                            await sleep(1000);
                            var tc_response = await fetch(tc_URL);
                            if (tc_response.status === 200) {
                                var current_tc_info = await tc_response.json();
                            } else if (tc_response.status === 404) {
                                code_real = false;
                            } else if (tc_response.status != 429 && tc_response.status != 504){
                                return console.log("Error Code Tournament Code Read 2: " + tc_response.status);
                            }
                        }
                    } else if (tc_response.status === 404) {
                        code_real = false;
                    } 
                    else {
                        var current_tc_info = await tc_response.json();
                    }

                }


                if (code_real) {

                    for (var o = 0; o < 10; o++) {
                        // CREATE ARRAYS
                        var winloss = current_tc_info["participants"][o]["stats"]["win"];
                        var champID = current_tc_info["participants"][o]["championId"]
                        var champNAME = CLIENT.championsID[champID].name;
                        if (winloss === true) {
                            winloss = "W";
                        } else {
                            winloss = "L";
                        }
                        if (champNAME === "MonkeyKing") champNAME = "Wukong";
                        var player_name = current_tc_info["participantIdentities"][o]["player"]["summonerName"];
                        var kda = current_tc_info["participants"][o]["stats"]["kills"] + "/" + current_tc_info["participants"][o]["stats"]["deaths"] +
                            "/" + current_tc_info["participants"][o]["stats"]["assists"];
                        game_list.push(champNAME + "|" + winloss + "|" + kda);

                        if (current_tc_info["participants"][o]["stats"]["firstBloodKill"]) fb_list.push(player_name);

                        kills_list.push(player_name +"|"+ current_tc_info["participants"][o]["stats"]["kills"]);
                        deaths_list.push(player_name +"|"+ current_tc_info["participants"][o]["stats"]["deaths"]);
                        assists_list.push(player_name +"|"+ current_tc_info["participants"][o]["stats"]["assists"]);
                        vision_list.push(player_name +"|"+ current_tc_info["participants"][o]["stats"]["visionScore"]);
                        damage_list.push(player_name +"|"+ current_tc_info["participants"][o]["stats"]["totalDamageDealtToChampions"]);
                        
                        var game_length = current_tc_info["gameDuration"];
                        var game_mins = Math.floor(game_length/60);
                        var game_secs = game_length-(game_mins*60);
                        var minions_killed = (current_tc_info["participants"][o]["stats"]["totalMinionsKilled"]) + (current_tc_info["participants"][o]["stats"]["neutralMinionsKilled"]);
                        var cs_per_min = (minions_killed/game_mins).toFixed(2);
                        cs_list.push(player_name + "|" + cs_per_min);

                        //var champNAME = CLIENT.championsID[champID].name;

                        if (current_tc_info["participants"][o]["stats"]["item0"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item0"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item1"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item1"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item2"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item2"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item3"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item3"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item4"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item4"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item5"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item5"]].name + "|" + winloss);
                        if (current_tc_info["participants"][o]["stats"]["item6"] != 0) item_list.push(CLIENT.item_names[current_tc_info["participants"][o]["stats"]["item6"]].name + "|" + winloss);

                    }

                }
                
            }


                // FIRST BLOOD COUNTER
                fb_list.sort();
                var fb_counter = 1;
                var fb_list_f = []
                var current_fb = "";

                for (var t = 0; t < fb_list.length; t++) {
                    if (t === 0) {
                        current_fb = fb_list[0];
                    } else if (fb_list[t] === current_fb) {
                        fb_counter += 1;
                        if (t === fb_list.length-1) console.log("test fb");
                    } else {
                        fb_list_f.push(fb_counter + " First Bloods | " + current_fb);
                        current_fb = fb_list[t];
                        fb_counter = 1;
                    }
                }

                fb_list_f.sort();
                fb_list_f.reverse();

                // KILL COUNTER
                kills_list.sort();
                var kill_list_f = [];
                var current_kill = "";
                var current_kill_count = 0;
                var game_count = 1;
                var split_kills = [];

                for (var t = 0; t < kills_list.length; t++) {
                    split_kills = kills_list[t].split("|");

                    if (t === 0) {
                        current_kill = split_kills[0];
                        current_kill_count = parseInt(split_kills[1]);
                    } else if (split_kills[0] === current_kill) {
                        game_count += 1;
                        current_kill_count += parseInt(split_kills[1]);
                    } else {
                        kill_list_f.push(current_kill_count + " Kills | " + current_kill + " | " + game_count + " games");
                        current_kill = split_kills[0];
                        current_kill_count = parseInt(split_kills[1]);
                        game_count = 1;
                    }
                }

                kill_list_f.sort();
                kill_list_f.reverse();

                // DEATH COUNTER
                deaths_list.sort();
                var death_list_final = [];
                var current_deaths = "";
                var current_deaths_count = 0;
                var game_count = 1;
                var split_deaths = [];

                for (var t = 0; t < deaths_list.length; t++) {
                    split_deaths = deaths_list[t].split("|");

                    if (t === 0) {
                        current_deaths = split_deaths[0];
                        current_deaths_count = parseInt(split_deaths[1]);
                    } else if (split_deaths[0] === current_deaths) {
                        game_count += 1;
                        current_deaths_count += parseInt(split_deaths[1]);
                    } else {
                        death_list_final.push(current_deaths_count + " Deaths | " + current_deaths + " | " + game_count + " games");
                        current_deaths = split_deaths[0];
                        current_deaths_count = parseInt(split_deaths[1]);
                        game_count = 1;
                    }
                }

                death_list_final.sort();
                death_list_final.reverse();

                // ASSISTS COUNTER
                assists_list.sort();
                var assists_list_f = [];
                var current_deaths = "";
                var current_deaths_count = 0;
                var game_count = 1;
                var split_assists = [];

                for (var t = 0; t < assists_list.length; t++) {
                    split_assists = assists_list[t].split("|");

                    if (t === 0) {
                        current_deaths = split_assists[0];
                        current_deaths_count = parseInt(split_assists[1]);
                    } else if (split_assists[0] === current_deaths) {
                        game_count += 1;
                        current_deaths_count += parseInt(split_assists[1]);
                    } else {
                        assists_list_f.push(current_deaths_count + " Deaths | " + current_deaths + " | " + game_count + " games");
                        current_deaths = split_assists[0];
                        current_deaths_count = parseInt(split_assists[1]);
                        game_count = 1;
                    }
                }

                assists_list_f.sort();
                assists_list_f.reverse();

                // VISION COUNTER
                vision_list.sort();
                var vision_list_f = [];
                var current_deaths = "";
                var current_deaths_count = 0;
                var game_count = 1;
                var split_vision = [];

                for (var t = 0; t < vision_list.length; t++) {
                    split_vision = vision_list[t].split("|");

                    if (t === 0) {
                        current_deaths = split_vision[0];
                        current_deaths_count = parseInt(split_vision[1]);
                    } else if (split_vision[0] === current_deaths) {
                        game_count += 1;
                        current_deaths_count += parseInt(split_vision[1]);
                    } else {
                        vision_list_f.push(current_deaths_count + " Vision | " + current_deaths + " | " + game_count + " games");
                        current_deaths = split_vision[0];
                        current_deaths_count = parseInt(split_vision[1]);
                        game_count = 1;
                    }
                }

                vision_list_f.sort();
                vision_list_f.reverse();

                // DAMAGE COUNTER
                damage_list.sort();
                var damage_list_f = [];
                var current_deaths = "";
                var current_deaths_count = 0;
                var game_count = 1;
                var split_damage = [];

                for (var t = 0; t < damage_list.length; t++) {
                    split_damage = damage_list[t].split("|");

                    if (t === 0) {
                        current_deaths = split_damage[0];
                        current_deaths_count = parseInt(split_damage[1]);
                    } else if (split_damage[0] === current_deaths) {
                        game_count += 1;
                        current_deaths_count += parseInt(split_damage[1]);
                    } else {
                        damage_list_f.push(current_deaths_count + " Damage | " + current_deaths + " | " + game_count + " games");
                        current_deaths = split_damage[0];
                        current_deaths_count = parseInt(split_damage[1]);
                        game_count = 1;
                    }
                }

                damage_list_f.sort();
                damage_list_f.reverse();

                // CS COUNTER
                cs_list.sort();
                var cs_list_f = [];
                var current_deaths = "";
                var current_deaths_count = 0;
                var game_count = 1;
                var split_cs = [];

                for (var t = 0; t < cs_list.length; t++) {
                    split_cs = cs_list[t].split("|");

                    if (t === 0) {
                        current_deaths = split_cs[0];
                        current_deaths_count = parseInt(split_cs[1]);
                    } else if (split_cs[0] === current_deaths) {
                        game_count += 1;
                        current_deaths_count += parseInt(split_cs[1]);
                    } else {
                        cs_list_f.push(current_deaths_count + " CS/MIN | " + current_deaths + " | " + game_count + " games");
                        current_deaths = split_cs[0];
                        current_deaths_count = parseInt(split_cs[1]);
                        game_count = 1;
                    }
                }

                cs_list_f.sort();
                cs_list_f.reverse();

                // ITEMS PICKED COUNTER
                item_list.sort();
                var count_item = 0;
                var current_item = "";
                var current_losses = 0;
                var current_wins = 0;
                var game_count = 0;
                var split_items = [];
                var item_list_f = [];
    
                for (var m = 0; m < item_list.length; m++) {
    
                    split_items = item_list[m].split("|");
                    
    
                    if (m === 0) { // First Game
    
                        current_item = split_items[0];
                        count_item = 1;
                        if (split_items[1] === "L") {
                            current_losses += 1;
                        } else {
                            current_wins += 1;
                        }
    
                    } else if (m === (game_count-1)) { // Last Game
    
                        if (split_items[0] === current_item) {
                            count_item += 1;
                            if (split_items[1] === "L") {
                                current_losses += 1;
                            } else {
                                current_wins += 1;
                            }
                        } else {
                            item_list_f.push(count_item + "|" + current_item + "|" + current_wins + "/" + current_losses);
    
                            current_item = split_items[0];
                            count_item = 1;
                            if (split_items[1] === "L") {
                                current_losses = 1;
                                current_wins = 0;
                            } else {
                                current_wins = 1;
                                current_losses = 0;
                            }
                        }
                        
                        item_list_f.push(count_item + "|" + current_item + "|" + current_wins + "/" + current_losses);
    
                    } else if (split_items[0] === current_item) { // Matching champ
    
                        count_item += 1;
                        if (split_items[1] === "L") {
                            current_losses += 1;
                        } else {
                            current_wins += 1;
                        }
    
                    } else { // Not matching champ
    
                        item_list_f.push(count_item + "|" + current_item + "|" + current_wins + "/" + current_losses);
                        current_item = split_items[0];
                        count_item = 1;
                        if (split_items[1] === "L") {
                            current_losses = 1;
                            current_wins = 0;
                        } else {
                            current_wins = 1;
                            current_losses = 0;
                        }
    
                    }
    
                }
    
                item_list_f.sort();

                // CHAMPS PICKED COUNTER
                game_list.sort();
                var count_champ = 0;
                var current_champ = "";
                var current_kills = 0;
                var current_deaths = 0;
                var current_assists = 0;
                var current_losses = 0;
                var current_wins = 0;
                var game_count = 0;
                var split_array = [];
                var picked_champs = [];
    
                for (var m = 0; m < game_list.length; m++) {
    
                    split_array = game_list[m].split("|");
                    split_kda = split_array[2].split("/");
    
                    if (m === 0) { // First Game
    
                        current_champ = split_array[0];
                        count_champ = 1;
                        current_kills += parseInt(split_kda[0]);
                        current_deaths += parseInt(split_kda[1]);
                        current_assists += parseInt(split_kda[2]);
                        if (split_array[1] === "L") {
                            current_losses += 1;
                        } else {
                            current_wins += 1;
                        }
    
                    } else if (m === (game_count-1)) { // Last Game
    
                        if (split_array[0] === current_champ) {
                            count_champ += 1;
                            if (split_array[1] === "L") {
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
                            if (split_array[1] === "L") {
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
                        if (split_array[1] === "L") {
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
                        if (split_array[1] === "L") {
                            current_losses = 1;
                            current_wins = 0;
                        } else {
                            current_wins = 1;
                            current_losses = 0;
                        }
    
                    }
    
                }
    
                champ_list.sort();

                // CHAMP FINAL ARRAY MAKER
                for (var j = 0; j < champ_list.length; j++) {
    
                    var champs_split = champ_list[j].split("|");
    
                    var win_loss_split = champs_split[2].split("/");
                    var win_loss = Math.floor(parseInt(win_loss_split[0])/(parseInt(win_loss_split[0])+parseInt(win_loss_split[1]))*100) + "% (" + win_loss_split[0] + "-" + win_loss_split[1] + ")";
                    champs_split[2] = win_loss;
                    var kda_split = champs_split[3].split("/");
                    var total_games = parseInt(champs_split[0]);
                    var avg_kda = (parseInt(kda_split[0])/total_games).toFixed(2) + "/" + (parseInt(kda_split[1])/total_games).toFixed(2) + "/" + (parseInt(kda_split[2])/total_games).toFixed(2)
                    champs_split[3] = avg_kda;
    
    
                    if (champs_split[0] === "1") {
                        picked_champs.push("1 GAME | " + champs_split[2] + " | " + champs_split[1] + " | " + champs_split[3]);
                    } else {
                        picked_champs.push(champs_split[0] + " GAMES | " + champs_split[2] + " | " + champs_split[1] + " | " + champs_split[3])
                    }
    
                }
    
                // CHAMP FINAL ARRAY SORTER
                picked_champs.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[1]) - parseInt(a.split("|")[1]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // ITEM FINAL ARRAY MAKER
                for (var j = 0; j < item_list_f.length; j++) {
    
                    var split_item2 = item_list_f[j].split("|");
    
                    var win_loss_split = split_item2[2].split("/");
                    var win_loss = Math.floor(parseInt(win_loss_split[0])/(parseInt(win_loss_split[0])+parseInt(win_loss_split[1]))*100) + "% (" + win_loss_split[0] + "-" + win_loss_split[1] + ")";
                    split_item2[2] = win_loss;
                    var total_games = parseInt(split_item2[0]);
    
    
                    if (split_item2[0] === "1") {
                        item_list_f[j] = "1 GAME | " + split_item2[2] + " | " + split_item2[1];
                    } else {
                        item_list_f[j] = split_item2[0] + " GAMES | " + split_item2[2] + " | " + split_item2[1];
                    }
    
                }
    
                // ITEM FINAL ARRAY SORTER
                item_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // KILL FINAL ARRAY MAKER
                for (var i = 0; i < kill_list_f.length; i++) {
                    var kills_split2 = kill_list_f[i].split("|");

                    var avg_kills = (parseInt(kills_split2[0])/parseInt(kills_split2[2])).toFixed(2);
                    kill_list_f[i] = avg_kills + " Kills |" + kills_split2[1] + "|" + kills_split2[2];
                }

                // KILL FINAL ARRAY SORTER
                kill_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // DEATHS FINAL ARRAY MAKER
                for (var i = 0; i < death_list_final.length; i++) {
                    var deaths_split2 = death_list_final[i].split("|");

                    var avg_deaths = (parseInt(deaths_split2[0])/parseInt(deaths_split2[2])).toFixed(2);
                    death_list_final[i] = avg_deaths + " Deaths |" + deaths_split2[1] + "|" + deaths_split2[2];
                }

                // DEATHS FINAL ARRAY SORTER
                death_list_final.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // ASSISTS FINAL ARRAY MAKER
                for (var i = 0; i < assists_list_f.length; i++) {
                    var split_assists2 = assists_list_f[i].split("|");

                    var avg_assists = (parseInt(split_assists2[0])/parseInt(split_assists2[2])).toFixed(2);
                    assists_list_f[i] = avg_assists + " Assists |" + split_assists2[1] + "|" + split_assists2[2];
                }

                // ASSISTS FINAL ARRAY SORTER
                assists_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // VISION FINAL ARRAY MAKER
                for (var i = 0; i < vision_list_f.length; i++) {
                    var split_vision2 = vision_list_f[i].split("|");

                    var avg_vision = (parseInt(split_vision2[0])/parseInt(split_vision2[2])).toFixed(2);
                    vision_list_f[i] = avg_vision + " Vision |" + split_vision2[1] + "|" + split_vision2[2];
                }

                // VISION FINAL ARRAY SORTER
                vision_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // DAMAGE FINAL ARRAY MAKER
                for (var i = 0; i < damage_list_f.length; i++) {
                    var split_damage2 = damage_list_f[i].split("|");

                    var avg_damage = (parseInt(split_damage2[0])/parseInt(split_damage2[2])).toFixed(2);
                    damage_list_f[i] = avg_damage + " Damage |" + split_damage2[1] + "|" + split_damage2[2];
                }

                // DAMAGE FINAL ARRAY SORTER
                damage_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // CS FINAL ARRAY MAKER
                for (var i = 0; i < cs_list_f.length; i++) {
                    var split_cs2 = cs_list_f[i].split("|");

                    var avg_cs = (parseInt(split_cs2[0])/parseInt(split_cs2[2])).toFixed(2);
                    cs_list_f[i] = avg_cs + " CS/MIN |" + split_cs2[1] + "|" + split_cs2[2];
                }

                // CS FINAL ARRAY SORTER
                cs_list_f.sort(function(a,b){
                    if(parseInt(a.split("|")[0]) === parseInt(b.split("|")[0])) {
                        return parseInt(b.split("|")[2]) - parseInt(a.split("|")[2]);
                    } else if(parseInt(a.split("|")[0]) > parseInt(b.split("|")[0])) {
                        return -1;
                    }  
                    return 1;
                });

                // MAKING JSON
                CLIENT.tt_info["Picked Champs"] = picked_champs;
                CLIENT.tt_info["First Bloods"] = fb_list_f;
                CLIENT.tt_info["Kills"] = kill_list_f;
                CLIENT.tt_info["Deaths"] = death_list_final;
                CLIENT.tt_info["Assists"] = assists_list_f;
                CLIENT.tt_info["Vision"] = vision_list_f;
                CLIENT.tt_info["Damage"] = damage_list_f;
                CLIENT.tt_info["CS"] = cs_list_f;
                CLIENT.tt_info["Items"] = item_list_f;
    
                try {
                    var value_entries = CLIENT.tt_info["Picked Champs"];
                    value_entries["Picked Champs"] += picked_champs;
                    CLIENT.tt_info["Picked Champs"] = value_entries;

                    var value_entries2 = CLIENT.tt_info["First Bloods"];
                    value_entries2["First Bloods"] += fb_list_f;
                    CLIENT.tt_info["First Bloods"] = value_entries2;

                    var value_entries3 = CLIENT.tt_info["Kills"];
                    value_entries3["Kills"] += kill_list_f;
                    CLIENT.tt_info["Kills"] = value_entries3;

                    var value_entries4 = CLIENT.tt_info["Deaths"];
                    value_entries4["Deaths"] += death_list_final;
                    CLIENT.tt_info["Deaths"] = value_entries4;

                    var value_entries5 = CLIENT.tt_info["Assists"];
                    value_entries5["Assists"] += assists_list_f;
                    CLIENT.tt_info["Assists"] = value_entries5;

                    var value_entries6 = CLIENT.tt_info["Vision"];
                    value_entries6["Vision"] += vision_list_f;
                    CLIENT.tt_info["Vision"] = value_entries6;

                    var value_entries7 = CLIENT.tt_info["Damage"];
                    value_entries7["Damage"] += damage_list_f;
                    CLIENT.tt_info["Damage"] = value_entries7;

                    var value_entries8 = CLIENT.tt_info["CS"];
                    value_entries8["CS"] += cs_list_f;
                    CLIENT.tt_info["CS"] = value_entries8;

                    var value_entries9 = CLIENT.tt_info["Items"];
                    value_entries9["Items"] += item_list_f;
                    CLIENT.tt_info["Items"] = value_entries9;

                } catch (err) {
                    var value_entries = {};
                    var value_entries = CLIENT.tt_info["Picked Champs"];
                    value_entries["Picked Champs"] += picked_champs;
                    CLIENT.tt_info["Picked Champs"] = value_entries;

                    var value_entries2 = {};
                    var value_entries2 = CLIENT.tt_info["First Bloods"];
                    value_entries2["First Bloods"] += fb_list_f;
                    CLIENT.tt_info["First Bloods"] = fb_list_f;

                    var value_entries3 = {};
                    var value_entries3 = CLIENT.tt_info["Kills"];
                    value_entries3["Kills"] += kill_list_f;
                    CLIENT.tt_info["Kills"] = kill_list_f;

                    var value_entries4 = {};
                    var value_entries4 = CLIENT.tt_info["Deaths"];
                    value_entries4["Deaths"] += death_list_final;
                    CLIENT.tt_info["Deaths"] = death_list_final;

                    var value_entries5 = {};
                    var value_entries5 = CLIENT.tt_info["Assists"];
                    value_entries5["Assists"] += assists_list_f;
                    CLIENT.tt_info["Assists"] = assists_list_f;

                    var value_entries6 = {};
                    var value_entries6 = CLIENT.tt_info["Vision"];
                    value_entries6["Vision"] += vision_list_f;
                    CLIENT.tt_info["Vision"] = vision_list_f;

                    var value_entries7 = {};
                    var value_entries7 = CLIENT.tt_info["Damage"];
                    value_entries7["Damage"] += damage_list_f;
                    CLIENT.tt_info["Damage"] = damage_list_f;

                    var value_entries8 = {};
                    var value_entries8 = CLIENT.tt_info["CS"];
                    value_entries8["CS"] += cs_list_f;
                    CLIENT.tt_info["CS"] = cs_list_f;

                    var value_entries9 = {};
                    var value_entries9 = CLIENT.tt_info["Items"];
                    value_entries9["Items"] += item_list_f;
                    CLIENT.tt_info["Items"] = item_list_f;
                }
    
                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/tt_info.json", JSON.stringify (CLIENT.tt_info, null, 4), err => {
                    if (err) throw err;
                })

        }
        readCodes();
    }
}