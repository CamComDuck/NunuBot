module.exports = {
    name: 'lock',
    description: 'lock a game from being bet on',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const fs = require("fs");
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json");
        CLIENT.saving_bets = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json");
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/Models/data.js");
        var found_game = false;

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");

        for (var i in CLIENT.saving_bets) {
            if (args[1] === i) found_game = true;
        }

        if (!found_game) return message.reply ("That game has no bets");

        CLIENT.saving_bets[args[1]]["LOCKED"] = true;

        fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/saving_bets.json", JSON.stringify (CLIENT.saving_bets, null, 4), err => {
            if (err) throw err;
        })

        message.channel.send ("Game has been locked.");
    }
}