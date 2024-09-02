module.exports = {
    name: 'rankupdate',
    description: 'Update all players ranks',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.testing_reading = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/testing_reading.json");
        const fetch = require("node-fetch");
        const fs = require("fs");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var api_key = "";
        var counter = 0;

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        

        Data.find({
            lb: "all"
        }).sort([
            ['streak', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);


            if (res.length === 0) {
                return message.reply ("There aren't any data entries.");
            } else {

                for (i = 0; i < res.length; i++) {

                    Data.findOne ({
                        userID: res[i].userID
                    }, (err, data) => {

                        if (err) console.log(err);
                        
                        var summoner_name = data.opgg;
                        

                        function sleep(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }

                        async function fetchDataAsync() {

                            if (summoner_name.startsWith("https://na.op.gg/summoner/userName=")) {
                                summoner_name = summoner_name.substr(35);

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
                                var URL = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerID + "?api_key=" + api_key;
                                var response = await fetch(URL);

                                if (response.status === 200) {
                                    var ranked_summ_info = await response.json()
                                } else if (response.status === 429) {
                                    while (response.status === 429) {
                                        await sleep(90000);
                                        var response = await fetch(URL);
                                        if (response.status === 200) {
                                            var ranked_summ_info = await response.json();
                                        } else if (response.status != 429){
                                            return console.log(response.status);
                                        }
                                    }
                                    
                                } else {
                                    return console.log ("hiiii" + err);
                                }


                                try {
                                    
                                    if (ranked_summ_info[0]["queueType"] === 'RANKED_SOLO_5x5') {
                                        var current_rank = ranked_summ_info[0]["tier"] + " " + ranked_summ_info[0]["rank"];
                                    } else if (ranked_summ_info[1]["queueType"] === 'RANKED_SOLO_5x5') {
                                        var current_rank = ranked_summ_info[1]["tier"] + " " + ranked_summ_info[1]["rank"];
                                    } else if (ranked_summ_info[2]["queueType"] === 'RANKED_SOLO_5x5') {
                                        var current_rank = ranked_summ_info[2]["tier"] + " " + ranked_summ_info[2]["rank"];
                                    }
                                    
                                    
                                } catch (err) {
                                    var current_rank = "UNRANKED";
                                }
                                
                                
                                //console.log(ranked_summ_info);
                                //console.log(current_rank);
                                data.rank = current_rank;
                                data.save().catch(err => console.log(err));
                                message.channel.send("Name: " + data.name + " | Rank: " + data.rank);
                                counter += 1;
                            }

                        }

                        fetchDataAsync();
                        
                        

                    })
                    
                }
                message.channel.send ("Done - " + counter + " Total People");
                
            }
            //message.reply ("Rank Update Complete");
        })

       

            /*
            var summoner_name = "Puppy";
            // https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Cam%20Com
            
            var URL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ summoner_name + "?api_key=" + api_key;
            const response = await fetch(URL);
            CLIENT.testing_reading = await response.json();
            console.log(CLIENT.testing_reading);

            fs.writeFile("C:/Users/camde/Desktop/Nunu Bot/jsons/testing_reading.json", JSON.stringify (CLIENT.testing_reading, null, 4), err => {
                if (err) throw err;
            })*/
        
        }
        
    }
