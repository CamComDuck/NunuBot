module.exports = {
    name: 'invite',
    description: 'request a secret invite code',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const audit_channel = CLIENT.channels.get('794706158476591124');
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }

        var invite_num = Math.floor(Math.random() * 100000);

            const audit_embed = new Discord.RichEmbed()
                .setTitle("Invite Command")
                .setColor('#aa8ed6')
                .setDescription("Command user: " + message.author.username + "\nCode Created: " + invite_num)
                .setTimestamp();
            audit_channel.send(audit_embed);

            const person_receiving = new Discord.RichEmbed()
                .setTitle("Invite Code Generated")
                .setColor("#B721FF")
                .setDescription("Your secret invite code is " + invite_num +". It is VERY IMPORTANT you get this invite code before inviting who you want this to count for, or we can't verify your Celestial Coins.\n" +
                "Tell the person you invite to DM this code to a staff member to verify your invite after they compete in a tournament.");
            message.author.send (person_receiving);

            message.reply ("Sent in your DM!");

    }
}