module.exports = {
    name: 'cs_add',
    description: 'enter a cs practice score',
    execute (CLIENT, message, wordies) {
        const fs = require("fs");
        CLIENT.cs_practice_history_json = require ("C:/Users/camde/Desktop/Nunu Bot/jsons/cs_history.json");
        const blacklisted = [";", "(", ")", ":", "/", "=", "%", "#", "*", '"', "~", "|", "^", "@"];
        const letters = "qwertyuioplkjhgfdsazxcvbnm";
        try {
            var cs_history_num = CLIENT.cs_practice_history_json["Next Number"].number;
        } catch (err) {
            cs_history_num = 1;
        }
        console.log(cs_history_num);
        
        
        let cs_total = "not checked yet";
        try { // Set amount of players
            if (wordies[2].includes(letters)) {
                cs_total = "no valid input";
                message.channel.send ("you didn't input a valid amount of cs");
                return;
            } else {
                cs_total = wordies[2];
            }

        } catch (err) {
            cs_total = "no valid input";
            message.channel.send ("you didn't input a valid amount of cs");
            return;
        }

        let game_time = "not checked yet";
        try { // Set amount of imposters
            if (wordies[3].includes(letters)) {
                game_time = "no valid input"
                message.channel.send ("you didn't input a valid game time");
                return;
            } else {
                game_time = wordies[3];
            }
        } catch (err) {
            game_time = "no valid input"
            message.channel.send ("you didn't input a valid game time");
            return;
        }

        let type_of_cs = "not checked yet";
        try { // Set winning team
            if (wordies[4] === "m") {
                type_of_cs = "Melee";
            } else if (wordies[4] === "r") {
                type_of_cs = "Ranged";
            } else if (wordies[4] === "j") {
                type_of_cs = "Jungle";
            } else {
                type_of_cs = "no valid input"
                message.channel.send ("you didn't input a valid type of cs");
                return;
            }
        } catch (err) {
            type_of_cs = "no valid input"
            message.channel.send ("you didn't input a valid type of cs");
            return;
        }

        try { // Check if there is a blacklisted character anywhere in the string
            for (var i in blacklisted) {
                if (wordies.includes(blacklisted[i])) {
                    message.channel.send("you typed a blacklisted character");
                    throw wordies;
                }
            }
        } catch (err) {
            return;
        }
        console.log(cs_total + " " + game_time + " " + type_of_cs);
        message.channel.send(cs_total + " " + game_time + " " + type_of_cs);

        CLIENT.cs_practice_history_json [cs_history_num] = {
            author: message.author.username,
            accountid: message.author.id,
            cs: cs_total,
            time: game_time,
            type: type_of_cs
        }
        CLIENT.cs_practice_history_json ["Next Number"] = {
            number: cs_history_num += 1
        } 

        fs.writeFile("C:/Users/camde/Desktop/Nunu Bot/jsons/cs_history.json", JSON.stringify (CLIENT.cs_practice_history_json, null, 4), err => {
            if (err) throw err;
            message.channel.send ("Thank you for your game *nom nom*");
        })
    }
}