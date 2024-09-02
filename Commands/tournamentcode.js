module.exports = {
    name: 'tournamentcode',
    description: 'yay codes',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.tournament_codes_list = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/tournament_codes.json");
        CLIENT.reading_code = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json");
        CLIENT.using_codes = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/using_codes.json");
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        CLIENT.summoner_spells = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/summoner_spells.json");
        const fetch = require("node-fetch");
        const fs = require("fs");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var info_saved = [];
        var banned_champs = [];

        // #admin-bots
        //if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        var api_key = "";
                        
        // var provider = 12315;
        // var tournamentID = 1876762;
        
        //console.log([chosen_code]);

        if (!args[1]) { // Generate a new code
            async function testing() {
                var current_tc = "NA1_4037411678";
                var sampleMatch = "https://americas.api.riotgames.com/lol/match/v5/matches/"+ current_tc + "?api_key=" + api_key;
                const response = await fetch(sampleMatch);
                CLIENT.reading_code = await response.json();
        
                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json", JSON.stringify (CLIENT.reading_code, null, 4), err => {
                    if (err) throw err;
                })
            }
            testing();
            

        } else if (args[1] === "end") { // Save results from a finished game

            console.log("wip");


        } else { // Read from a code

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }


            var sampleTournament = CLIENT.using_codes[args[1]].tournament_code;
            
            //var sampleTournament = "NA04728-00a1464e-7be9-4556-82b0-783b479a9b95";
            //var sampleTournament = "NA048d5-fecf59d0-19c9-4062-b25f-6424a3d74cfd";
            var sampleMatch = "https://na1.api.riotgames.com/lol/match/v4/matches/by-tournament-code/" + sampleTournament + "/ids?api_key=" + api_key;
    
            async function fetchDataAsync1() {
                const response = await fetch(sampleMatch);
                if (response.status != 200) {
                    message.reply("Error Code: " + response.status + " - " + response.statusText);
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
                    CLIENT.reading_code = await response.json();
        
                    fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json", JSON.stringify (CLIENT.reading_code, null, 4), err => {
                        if (err) throw err;
                    })
                
                    await sleep(500);

                    try {
                        var participant_list = Object.entries(CLIENT.reading_code.participants);
                        var participant_identities_list = Object.entries(CLIENT.reading_code.participantIdentities);
                        var team_information = Object.entries(CLIENT.reading_code.teams);
                    } catch (err) {
                        console.log(err);
                        return;
                    }
                
                    if (team_information[0][1]["win"] === "Fail") {
                        var blue_team_win = "Blue Team Loss";
                        var red_team_win = "Red Team Win";
                    } else {
                        var blue_team_win = "Blue Team Win";
                        var red_team_win = "Red Team Loss";
                    }

                    var game_length = CLIENT.reading_code["gameDuration"]
                    var game_mins = Math.floor(game_length/60);
                    var game_secs = game_length-(game_mins*60);
        
                    const game_embed = new Discord.RichEmbed()
                        .setTitle("Game Completed " + game_mins + ":" + game_secs)
                        .setColor('0318fc');
        
        
                    for(var i = 0; i < 10; i++){
            
                        var playing_champID = participant_list[i][1]["championId"];
                        var playing_champNAME = CLIENT.championsID[playing_champID].name;

                        var used_spellID1 = participant_list[i][1]["spell1Id"];
                        var used_spell_name1 = CLIENT.summoner_spells[used_spellID1].name;

                        var used_spellID2 = participant_list[i][1]["spell2Id"];
                        var used_spell_name2 = CLIENT.summoner_spells[used_spellID2].name;

                        var minions_killed = (participant_list[i][1]["stats"]["totalMinionsKilled"]) + (participant_list[i][1]["stats"]["neutralMinionsKilled"]);

                        
                        var info_tb_saved = participant_identities_list[i][1]["player"]["summonerName"] +
                        " | " + playing_champNAME + " " + used_spell_name1 + " " + used_spell_name2 +
                        " | " + participant_list[i][1]["stats"]["kills"] +
                        "/" + participant_list[i][1]["stats"]["deaths"] +
                        "/" + participant_list[i][1]["stats"]["assists"] +
                        " " + minions_killed + "cs";
            
                        info_saved.push(info_tb_saved);
                    
                    }

                    for (var t = 0; t < 5; t++) {
                        try {
                            var banned_champID = team_information[0][1]["bans"][t]["championId"];
                            var banned_champNAME = CLIENT.championsID[banned_champID].name;
                        } catch (err) {
                            var banned_champNAME = "None";
                        }
                        

                        banned_champs.push(banned_champNAME);
                    }

                    for (var b = 0; b < 5; b++) {
                        try {
                            var banned_champID = team_information[1][1]["bans"][b]["championId"];
                            var banned_champNAME = CLIENT.championsID[banned_champID].name;
                        } catch (err) {
                            var banned_champNAME = "None";
                        }
                        

                        banned_champs.push(banned_champNAME);
                    }

                    var all_discords = [" | NO DISCORD", " | NO DISCORD", " | NO DISCORD",
                    " | NO DISCORD", " | NO DISCORD", " | NO DISCORD", " | NO DISCORD", " | NO DISCORD", " | NO DISCORD", " | NO DISCORD"];

                    Data.find({
                        registered: true
                    }).sort([
                        ['streak', 'descending']
                    ]).exec((err, res) => {
                        if (err) console.log(err);
                        //console.log("Res: " + res);
        
                        if (res.length === 0) {
                            return message.reply ("There aren't any data entries.");
                        } else {
            
                            for (i = 0; i < res.length; i++) {
            
                                Data.findOne ({
                                    userID: res[i].userID
                                }, (err, data) => {
            
                                    if (err) console.log(err);
                                    
                                    async function fetchDataAsync2() {

                                        var summoner_name = data.opgg;
                                        //console.log(summoner_name);
                                        
                                        if (summoner_name.startsWith("https://na.op.gg/summoner/userName=")) {
                                            try {
                            
                                                summoner_name = summoner_name.substr(35);
                    
                                                var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                                                var response = await fetch(URL);
                    
                                            } catch (err) {
                    
                                                summoner_name = encodeURIComponent(summoner_name);
                    
                                                var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                                                var response = await fetch(URL);
                                            }
            
                                            var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
                                            var response = await fetch(URL);
            
                                            if (response.status === 200) {
                                                var full_summ_info = await response.json();
                                            } else if (response.status === 429) {
                                                while (response.status === 429) {
                                                    await sleep(500);
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
                                            var summ_accountID = full_summ_info["accountId"];
                                            //console.log("person:" + data.name + " " + summ_accountID)
                                            for (var h = 0; h < 10; h++) {
                                                if (summ_accountID === participant_identities_list[h][1]["player"]["accountId"]) {
                                                    var info_tb_saved2 = " | " + data.name + " " + data.rank;
                                                    all_discords[h] = info_tb_saved2;
                                                    //console.log(all_discords);
                                                    /*
                                                    if (h < 5 && blue_team_win === "Blue Team Win") {
                                                        data.wins += 1;
                                                        data.save().catch(err => console.log(err));
                                                        message.channel.send (data.name + " now has " + data.wins + " wins.");
                                                    } else if (h > 4 && blue_team_win === "Blue Team Win") {
                                                        data.losses += 1;
                                                        data.save().catch(err => console.log(err));
                                                        message.channel.send (data.name + " now has " + data.losses + " losses.");
                                                    } else if (h < 5 && red_team_win === "Red Team Win") {
                                                        data.losses += 1;
                                                        data.save().catch(err => console.log(err));
                                                        message.channel.send (data.name + " now has " + data.losses + " losses.");
                                                    } else if (h > 4 && red_team_win === "Red Team Win") {
                                                        data.wins += 1;
                                                        data.save().catch(err => console.log(err));
                                                        message.channel.send (data.name + " now has " + data.wins + " wins.");
                                                    }
                                                    */
                                                }
                                                //console.log(h + " " + participant_identities_list[h][1][0]["player"])
                                            }
                                            
                                        }
                                    }
                                    fetchDataAsync2()
                                })
                            }
                            
                        }
                       
                    })

                
                await sleep(25000);
                //console.log(all_discords);

                var top_emote = "<:Top:793328240093298721>";
                var jg_emote = "<:Jungle:793328240143630345>";
                var mid_emote = "<:Mid:793328240374448138>";
                var adc_emote = "<:ADC:793328240516661298>";
                var supp_emote = "<:Support:793328240404070406>";
    
                //console.log(info_saved);
                //console.log(banned_champs);

                game_embed.addField(blue_team_win,
                    top_emote + " " + info_saved[0] + all_discords[0] + "\n" +
                    jg_emote + " " + info_saved[1] + all_discords[1] + "\n" +
                    mid_emote + " " + info_saved[2] + all_discords[2] + "\n" +
                    adc_emote + " " + info_saved[3] + all_discords[3] + "\n" +
                    supp_emote + " " + info_saved[4] + all_discords[4] + "\n" +
                    "Bans: " + banned_champs[0] + ", " + banned_champs[1] + ", " + banned_champs[2] + ", " + banned_champs[3] + ", " + banned_champs[4]);

                game_embed.addField(red_team_win,
                    top_emote + " " + info_saved[5] + all_discords[5] + "\n" +
                    jg_emote + " " + info_saved[6] + all_discords[6] + "\n" +
                    mid_emote + " " + info_saved[7] + all_discords[7] + "\n" +
                    adc_emote + " " + info_saved[8] + all_discords[8] + "\n" +
                    supp_emote + " " + info_saved[9] + all_discords[9] + "\n" +
                    "Bans: " + banned_champs[5] + ", " + banned_champs[6] + ", " + banned_champs[7] + ", " + banned_champs[8] + ", " + banned_champs[9]);


                message.channel.send(game_embed);
                //message.channel.send(CLIENT.reading_code["gameDuration"]);

                }
                fetchDataAsync();

                
            })

        }
        
    }
}