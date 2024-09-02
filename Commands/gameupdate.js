module.exports = {
    name: 'gameupdate',
    description: 'Update the version and champion list',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');

        CLIENT.champions_info = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/champions_info.json");
        CLIENT.versions = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/versions.json");
        CLIENT.championsID = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json");
        CLIENT.full_items = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/full_items.json");
        CLIENT.item_names = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/item_names.json");
        const fetch = require("node-fetch");
        const fs = require("fs");

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        async function fetchDataAsync() {

            // Find the current version

            var url_versions = "https://ddragon.leagueoflegends.com/api/versions.json";
            var response_versions = await fetch(url_versions);
            CLIENT.versions = await response_versions.json();

            fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/versions.json", JSON.stringify (CLIENT.versions, null, 4), err => {
                if (err) throw err;
            })

            // Create updated champion list

            var url_champions = "http://ddragon.leagueoflegends.com/cdn/" + CLIENT.versions[0] + "/data/en_US/champion.json";
            var response_champions = await fetch(url_champions);
            CLIENT.champions_info = await response_champions.json();
            
            fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/champions_info.json", JSON.stringify (CLIENT.champions_info, null, 4), err => {
                if (err) throw err;
            })

            // Create easy JSON with champ key to champ name
    
            let champion_list = Object.entries(CLIENT.champions_info.data);

            for(var i in champion_list){

                CLIENT.championsID [champion_list[i][1].key] = {
                    name: champion_list[i][0]
                }

                fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/championsID.json", JSON.stringify (CLIENT.championsID, null, 4), err => {
                    if (err) throw err;
                })
                
            }

            // Create JSON with item names

            var testingURL = "http://ddragon.leagueoflegends.com/cdn/" + CLIENT.versions[0] + "/data/en_US/item.json";
            var testingRESPONSE = await fetch(testingURL);
            CLIENT.full_items = await testingRESPONSE.json();

            fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/full_items.json", JSON.stringify (CLIENT.full_items, null, 4), err => {
                if (err) throw err;
            })

            // Create easy JSON with item key to item names

            let item_list = Object.entries(CLIENT.full_items.data);

                for(var i in item_list){

                    CLIENT.item_names [item_list[i][0]] = {
                        name: item_list[i][1]["name"]
                    }
    
                    fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/item_names.json", JSON.stringify (CLIENT.item_names, null, 4), err => {
                        if (err) throw err;
                    })
                
                }

            
        }
        fetchDataAsync();

        message.reply ("Game update complete.");

        const audit_embed = new Discord.RichEmbed()
            .setTitle("Game Update Command")
            .setColor('fdcb58')
            .setDescription("Command user: " + message.author.username + "\nNew Version: " + CLIENT.versions[0]);
        audit_channel.send(audit_embed);
    }
}