module.exports = {
    name: 'game',
    description: 'enter a ranked among us game',
    execute (CLIENT, message, wordies) {
        try {
            var au_game_num = CLIENT.ranked["Next Number"].number;
        } catch (err) {
            au_game_num = 1;
        }
        console.log(au_game_num)
        
        const fs = require("fs");
        CLIENT.ranked = require ("C:/Users/camde/Desktop/Nunu Bot/jsons/among_us_ranked.json");
        const blacklisted = [";", "(", ")", ":", "/", "=", "%", "#", "*", '"', "~", "|", "^", "@"];
        let totalplayers = "not checked yet";
        try { // Set amount of players
            if (wordies[1] === "6" || wordies[1] === "7" || wordies[1] === "8" || wordies[1] === "9" || wordies[1] === "10") {
                totalplayers = wordies[1];
            } else {
                totalplayers = "no valid input";
                message.channel.send ("you didn't input a valid amount of players");
                return;
            }

        } catch (err) {
            totalplayers = "no valid input";
            message.channel.send ("you didn't input a valid amount of players");
            return;
        }

        let totalimposters = "not checked yet";
        try { // Set amount of imposters
            if (wordies[2] === "2" && totalplayers === "6") {
                totalimposters = "no valid input"
                message.channel.send ("you didn't input a valid amount of imposters");
                return;
            } else if (wordies[2] === "1" || wordies[2] === "2") {
                totalimposters = wordies[2];
            } else {
                totalimposters = "no valid input"
                message.channel.send ("you didn't input a valid amount of imposters");
                return;
            }
        } catch (err) {
            totalimposters = "no valid input"
            message.channel.send ("you didn't input a valid amount of imposters");
            return;
        }

        let winningteam = "not checked yet";
        try { // Set winning team
            if (wordies[3] === "i") {
                winningteam = "Imposter"
            } else if (wordies[3] === "c") {
                winningteam = "Crew"
            } else {
                winningteam = "no valid input"
                message.channel.send ("you didn't input a valid winning team");
                return;
            }
        } catch (err) {
            winningteam = "no valid input"
            message.channel.send ("you didn't input a valid winning team");
            return;
        }

        let playerteam = "not calculated yet";
        try { // Set player's team
            if (wordies[4] === "i") {
                playerteam = "Imposter";
            } else if (wordies[4] === "c") {
                playerteam = "Crew"
            } else {
                playerteam = "no valid input";
                message.channel.send ("you didn't input a valid player team");
                return;
            }
        } catch (err) {
            playerteam = "no valid input";
            message.channel.send ("you didn't input a valid player team");
            return;
        }

        let winloss = "not calculated yet";
        try { // Determine if it was a win or loss
            if (winningteam === playerteam) {
                winloss = "Win";
            } else if (winningteam !== playerteam) {
                winloss = "Loss";
            } else {
                let winloss = "no valid input";
                message.channel.send ("you didn't input either the winning team or your role")
                return;
            }
        } catch (err) {
            let winloss = "no valid input";
            message.channel.send ("you didn't input either the winning team or your role")
            return;
        }

        try { // Add or subtract elo
            var maxgamenum1 = au_game_num-1;
            var playerelo = 0;
            for (let au_game_num=maxgamenum1; au_game_num>0; au_game_num--) {
                if (CLIENT.ranked[au_game_num].accountid === message.author.id) {
                    if (CLIENT.ranked[au_game_num].playerlp === undefined || CLIENT.ranked[au_game_num].playerlp === NaN || maxgamenum === 0) {
                        throw playerelo;
                    } else if (winloss === "Win") {
                        var playerelo = CLIENT.ranked[au_game_num].playerlp += 1;
                    } else if (winloss === "Loss") {
                        var playerelo = CLIENT.ranked[au_game_num].playerlp -= 1;
                    }
                    
                    au_game_num = 0;
                }
            }
        } catch(err) {
            var playerelo = 0;
            if (winloss === "Win") {
                var playerelo = 1;
            } else if (winloss === "Loss") {
                var playerelo = -1;
            }
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

        CLIENT.ranked [au_game_num] = {
            author: message.author.username,
            accountid: message.author.id,
            players: totalplayers,
            imposters: totalimposters,
            playersteam: playerteam,
            winorloss: winloss,
            playerlp: playerelo
        }
        CLIENT.ranked ["Next Number"] = {
            number: au_game_num += 1
        } 

        fs.writeFile("C:/Users/camde/Desktop/Nunu Bot/jsons/among_us_ranked.json", JSON.stringify (CLIENT.ranked, null, 4), err => {
            if (err) throw err;
            message.channel.send ("Thank you for your game *nom nom*");
        })
    }
}