module.exports = {
    name: 'commands',
    description: 'display the commands for nunu bot',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');
        
        
        const display_commands = new Discord.RichEmbed()
            .setTitle("Nunu Bot Commands List")
            .setColor('B721FF')
            .setDescription("() = required\n[] = optional")
            .addField("Basic",
                "**+profile [ping_person]** -> *Display the profile of yourself or another person*")
            /*
                "**+balance [ping_person] OR +bal [ping_person]** -> *Display the balance of yourself or another person's Celestial Coins*\n" +
                "**+help OR +commands** -> *Displays this message*\n" +
                "**+invite** -> *Get a secret invite code to verify your invite for Celestial Coins*\n" +
                "**+leaderboard OR +lb** -> *View the Celestial Coin leaderboard*" +
                "**+pay (ping_person) (amount)** -> *Pay a user with Celestial Coins*")
            
            .addField("Gambling and Fun Games", 
                "**+coinflip (amount)** -> *Coinflip the amount of Celestial Coins wagered*\n" +
                "**+slots (amount)** -> *Gamble Celestial Coins on the slots machine. Find or match stars for even bigger rewards!*\n" +
                "**+snowman** -> *Play hangman, but with a snowman*",)
                */
            .addField("Tournaments",
                "**+profile (support/op.gg link)** -> *Edit your role or op.gg link*\n" +
                "**+join** -> *Register for the next weekend tournament. Must fill out all info first*\n" +
                "**+group (group_letter)** -> *View all competitors in a group*\n" +
                "**+tournamentcode OR +tc** -> *Receive a tournament code to be used in a 5v5 custom*\n" + 
                "**+unregister** -> *Unregister to the next tournament*\n" +
                "**+registered [page_num]** -> *View all registered players*")
            .setFooter("Willump hungry");


            if (message.channel.id == "768560694035087430") {
                message.author.send(display_commands);
            } else if (message.channel.id === "793325534355390464") {
                display_commands.addField("Moderator",
                "**+adminpay (ping_person) (amount) OR +ap (ping_person) (amount)** -> *Give Celestial Coins to someone from the bank*\n" +
                "**+warn (ping_person)** -> *Warn a user as punishment*\n" +
                "**+addwin (ping_person) [amount]** -> *Manually add wins to player*\n" +
                "**+addloss (ping_person) [amount]** -> *Manually add losses to player*\n" +
                "**+gameupdate** -> *Update the Riot API files after a League update*\n" +
                "**+groupadd (ping_person) (group_letter)** -> *Add a competitor to their group*\n" +
                "**+noshow (ping_person)** -> *Unregister someone after not showing*\n" +
                "**+reset** -> *Used after a tournament to calculate streaks*\n" +
                "**+unstreak** -> *Used after a tournament to calculate streaks*");
                message.author.send(display_commands);
            } else {
                message.author.send(display_commands);
            }
        
        
        message.reply ("Sent in your DM!");
        const audit_embed = new Discord.RichEmbed()
            .setTitle("Help Command")
            .setColor('aa8ed6')
            .setDescription("Command user: " + message.author.username);
        audit_channel.send(audit_embed);
    }
}