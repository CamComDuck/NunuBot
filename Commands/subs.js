module.exports = {
    name: 'subs',
    description: 'display subs neatly',
    execute (message, args, CLIENT, base_folder) {
        const mongoose = require("mongoose");
        const botconfig = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/botconfig.json")
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        

        // #admin-bots
        if (message.channel.id != "793325534355390464") return message.reply ("You don't have permission to use this command.");
        var subs_check = true;
        var subs_list = [];

        for (var i = 0; i < args.length; i++) {
            var subs_list_split = args[i].split(",");
            if (subs_check) subs_list_split[0] = subs_list_split[0].substring(5);
            //console.log(subs_list_split);
            if (subs_list_split[0] != "cam_com") {
                if (subs_list_split[3] > 1) {
                    subs_list.push(subs_list_split[2] + " | " + subs_list_split[3] + " Months | " + subs_list_split[0]);
                } else {
                    subs_list.push(subs_list_split[2] + " | " + subs_list_split[3] + " Month  | " + subs_list_split[0]);
                }
                
            }
            subs_check = false;
        }
        subs_list.sort();
        subs_list.reverse();
        for (var o = 0; o < subs_list.length; o++) message.channel.send(subs_list[o]);
        if (o === subs_list.length) message.channel.send(o + " total subs");
        //console.log(subs_list);
        
        var subs_list = args;

        //console.log(subs_list);
    }
}