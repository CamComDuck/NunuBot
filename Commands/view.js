module.exports = {
    name: 'view',
    description: 'yay more codes',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.reading_code = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json");
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


        if (!args[1]) { // No code entered

            return message.reply ("Please enter a tournament code.");
            
        } else { // Read from a code

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }



            var sampleTournament = args[1];
            var sampleMatch = "https://na1.api.riotgames.com/lol/match/v4/matches/by-tournament-code/" + sampleTournament + "/ids?api_key=" + api_key;
    
            async function fetchDataAsync1() {
                const response = await fetch(sampleMatch);
                if (response.status != 200) {
                    message.reply("Error Code: " + response.status + " - " + response.statusText);
                } else {
                    var sample_match_num = await response.json();
                    sample_match_num = sample_match_num[0];
                    console.log(sample_match_num)
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
                    if (game_secs.toFixed(0).length === 1) game_secs += "0";
        
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

                        var vision_score = participant_list[i][1]["stats"]["visionScore"];
                        var wards_placed = participant_list[i][1]["stats"]["wardsPlaced"];
                        var wards_killed = participant_list[i][1]["stats"]["wardsKilled"];
                        var control_wards = participant_list[i][1]["stats"]["visionWardsBoughtInGame"];

                        var dmg_dealt = participant_list[i][1]["stats"]["totalDamageDealtToChampions"];
                        var dmg_heal = participant_list[i][1]["stats"]["totalHeal"];

                        
                        var info_tb_saved = participant_identities_list[i][1]["player"]["summonerName"] +
                        " | " + playing_champNAME + " " + used_spell_name1 + " " + used_spell_name2 +
                        " | " + participant_list[i][1]["stats"]["kills"] +
                        "/" + participant_list[i][1]["stats"]["deaths"] +
                        "/" + participant_list[i][1]["stats"]["assists"] +
                        " " + minions_killed + "cs" +
                        "\n > Vision Score: " + vision_score +
                        //" Wards Placed: " + wards_placed +
                        //" Wards Killed: " + wards_killed +
                        " Control Wards: " + control_wards +
                        "\n > Damage: " + dmg_dealt +
                        " Healed: " + dmg_heal;
            
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

                var top_emote = "<:Top:793328240093298721>";
                var jg_emote = "<:Jungle:793328240143630345>";
                var mid_emote = "<:Mid:793328240374448138>";
                var adc_emote = "<:ADC:793328240516661298>";
                var supp_emote = "<:Support:793328240404070406>";
    
                //console.log(info_saved);
                //console.log(banned_champs);

                game_embed.addField(blue_team_win,
                    top_emote + " " + info_saved[0] + "\n" +
                    jg_emote + " " + info_saved[1] + "\n" +
                    mid_emote + " " + info_saved[2] + "\n" +
                    adc_emote + " " + info_saved[3] + "\n" +
                    supp_emote + " " + info_saved[4] + "\n" +
                    "Bans: " + banned_champs[0] + ", " + banned_champs[1] + ", " + banned_champs[2] + ", " + banned_champs[3] + ", " + banned_champs[4]);

                game_embed.addField(red_team_win,
                    top_emote + " " + info_saved[5] + "\n" +
                    jg_emote + " " + info_saved[6] + "\n" +
                    mid_emote + " " + info_saved[7] + "\n" +
                    adc_emote + " " + info_saved[8] + "\n" +
                    supp_emote + " " + info_saved[9] + "\n" +
                    "Bans: " + banned_champs[5] + ", " + banned_champs[6] + ", " + banned_champs[7] + ", " + banned_champs[8] + ", " + banned_champs[9]);


                message.channel.send(game_embed);

                }
                fetchDataAsync();

                
            })

        }
        
    }
}