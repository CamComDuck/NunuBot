module.exports = {
    name: 'matches',
    description: 'view ranked among us match history',
    execute (CLIENT, message, au_game_num) {
        
        const Discord = require('discord.js')
        const fs = require("fs");
        CLIENT.ranked = require ("C:/Users/camde/Desktop/Nunu Bot/ranked.json")
        // try {
            const creatematchbeds = new Discord.RichEmbed().setTitle(message.author.username + "'s Match History").setColor('#F7DC32').setThumbnail(message.author.displayAvatarURL).setFooter("Only displays 6 most recent games");
            let maxgamenum2 = au_game_num-1;
            let matchcount = 0;
            for (let au_game_num=maxgamenum2; au_game_num>0; au_game_num--) {
                if (CLIENT.ranked[au_game_num].accountid === message.author.id) {
                    creatematchbeds.addField(CLIENT.ranked[au_game_num].playersteam + " " + CLIENT.ranked[au_game_num].winorloss, "Num of players: " + CLIENT.ranked[au_game_num].players +
                    "\nNum of imposters: " + CLIENT.ranked[au_game_num].imposters + "\nGame num: " + au_game_num, true);
                    matchcount += 1;
                }
                if (matchcount === 6) {
                    au_game_num = 0;
                }
            }
            creatematchbeds.setDescription("Player's points: " + CLIENT.ranked[maxgamenum2].playerlp)
            message.channel.send (creatematchbeds)
        
        // } catch(err) {
            // message.channel.send ("matches broke")
        // }
    }
}