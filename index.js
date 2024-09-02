const Discord = require('discord.js')
const CLIENT = new Discord.Client();
const fs = require("fs");
CLIENT.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const blacklisted = [";", "(", ")", ":", "/", "=", "%", "#", "*", '"', "~", "|", "^", "@"];
var turned_on = false;
var base_folder = "camde";

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    CLIENT.commands.set(command.name, command);
}

// Fun Commands
CLIENT.on('ready', () =>{
    console.log('This bot is online');
})

// Command Handler
CLIENT.on('message', async message=>{
    if(!message.content.startsWith("+")) return;
    if (message.content.startsWith("+subs")) {
        var args = message.content.substring("+".length).split("\n");
        CLIENT.commands.get('subs').execute(message, args, CLIENT, base_folder);
    } else {
        var args = message.content.substring("+".length).split(" ");
    }
    switch(args[0]) {

        case 'commands': // Display commands of Nunu Bot
            CLIENT.commands.get('commands').execute(message, args, CLIENT, base_folder);
            break;

        case 'displaygame': // Display a live game
            CLIENT.commands.get('displaygame').execute(message, args, CLIENT, base_folder);
            break;

        case 'dp': // Display a live game
            CLIENT.commands.get('displaygame').execute(message, args, CLIENT, base_folder);
            break;

        case 'ga': // Add a user to a group
            CLIENT.commands.get('groupadd').execute(message, args, CLIENT, base_folder);
            break;

        case 'gameupdate': // View all users in a group
            CLIENT.commands.get('gameupdate').execute(message, args, CLIENT, base_folder);
            break;

        case 'group': // View all users in a group
            CLIENT.commands.get('group').execute(message, args, CLIENT, base_folder);
            break;

        case 'groupadd': // Add a user to a group
            CLIENT.commands.get('groupadd').execute(message, args, CLIENT, base_folder);
            break;

        case 'help': // Display commands of Nunu Bot
            CLIENT.commands.get('commands').execute(message, args, CLIENT, base_folder);
            break;

        case 'join': // Get invite code to verify invitation
            CLIENT.commands.get('join').execute(message, args, CLIENT, base_folder);
            break;

        case 'lb': // Get invite code to verify invitation
            CLIENT.commands.get('leaderboard').execute(message, args, CLIENT, base_folder);
            break;

        case 'leaderboard': // Get invite code to verify invitation
            CLIENT.commands.get('leaderboard').execute(message, args, CLIENT, base_folder);
            break;

        case 'profile': // Display the profile of a user
            CLIENT.commands.get('profile').execute(message, args, CLIENT, base_folder);
            break;

        case 'rankupdate': // Update the ranks of all players
            CLIENT.commands.get('rankupdate').execute(message, args, CLIENT, base_folder);
            break;

        case 'register': // Get invite code to verify invitation
            CLIENT.commands.get('join').execute(message, args, CLIENT, base_folder);
            break;
        
        case 'registered': // View all registered players
            CLIENT.commands.get('registered').execute(message, args, CLIENT, base_folder);
            break;
        
        case 'ru': // Update the ranks of all players
            CLIENT.commands.get('rankupdate').execute(message, args, CLIENT, base_folder);
            break;

        case 'snowman': // Snowman hangman game
            var player = message.author.id
            CLIENT.commands.get('snowman').execute(message, turned_on, CLIENT, player, base_folder);
            break;

        case 'tc': // Get tournament code to play a tournament game
            CLIENT.commands.get('tournamentcode').execute(message, args, CLIENT, base_folder);
            break;

        case 'tournamentcode': // Get tournament code to play a tournament game
            CLIENT.commands.get('tournamentcode').execute(message, args, CLIENT, base_folder);
            break;
        
        case 'unregister': // Unregister to the next tournament
            CLIENT.commands.get('unregister').execute(message, args, CLIENT, base_folder);
            break;

        case 'view': // Display the match history of someone
            CLIENT.commands.get('view').execute(message, args, CLIENT, base_folder);
            break;

        case 'msgc': // Display the match history of someone
            CLIENT.commands.get('msgc').execute(message, args, CLIENT, base_folder);
            break;
        
        case 'balance': // Display CC balance
            CLIENT.commands.get('balance').execute(message, args, CLIENT, base_folder);
            break;
            
        case 'bal': // Display CC balance
            CLIENT.commands.get('balance').execute(message, args, CLIENT, base_folder);
            break;

        case 'coinflip': // Coinflip for CC gamble
            CLIENT.commands.get('coinflip').execute(message, args, CLIENT, base_folder);
            break;

        case 'adminpay': // Give CC to a user
            CLIENT.commands.get('adminpay').execute(message, args, CLIENT, base_folder);
            break;

        case 'ap': // Give CC to a user
            CLIENT.commands.get('adminpay').execute(message, args, CLIENT, base_folder);
            break;

        case 'warn': // Warn a user for breaking a rule
            CLIENT.commands.get('warn').execute(message, args, CLIENT, base_folder);
            break;

        case 'slots': // Play slots for CC gamble
            CLIENT.commands.get('slots').execute(message, args, CLIENT, base_folder);
            break;

        case 'invite': // Get invite code to verify invitation
            CLIENT.commands.get('invite').execute(message, args, CLIENT, base_folder);
            break;

        case 'reset': // Get invite code to verify invitation
            CLIENT.commands.get('reset').execute(message, args, CLIENT, base_folder);
            break;

        case 'unstreak': // Get invite code to verify invitation
            CLIENT.commands.get('unstreak').execute(message, args, CLIENT, base_folder);
            break;

        case 'noshow': // Get invite code to verify invitation
            CLIENT.commands.get('noshow').execute(message, args, CLIENT, base_folder);
            break;

        case 'addloss': // Manually add a loss to a competitor
            CLIENT.commands.get('addloss').execute(message, args, CLIENT, base_folder);
            break;

        case 'al': // Manually add a loss to a competitor
            CLIENT.commands.get('addloss').execute(message, args, CLIENT, base_folder);
            break;

        case 'aw': // Manually add a win to a competitor
            CLIENT.commands.get('addwin').execute(message, args, CLIENT, base_folder);
            break;

        case 'addwin': // Manually add a win to a competitor
            CLIENT.commands.get('addwin').execute(message, args, CLIENT, base_folder);
            break;

        case 'shop': // Buy items with CC
            CLIENT.commands.get('shop').execute(message, args, CLIENT, base_folder);
            break;

        case 'pay': // Give money to another user
            CLIENT.commands.get('pay').execute(message, args, CLIENT, base_folder);
            break;

        case 'bet': // Bet on a game with celestial coins
            CLIENT.commands.get('bet').execute(message, args, CLIENT, base_folder);
            break;

        case 'lock': // Display a live game
            CLIENT.commands.get('lock').execute(message, args, CLIENT, base_folder);
            break;
            
        case 'payout': // Display a live game
            CLIENT.commands.get('payout').execute(message, args, CLIENT, base_folder);
            break;

        case 'mh': // Display the match history of someone
            CLIENT.commands.get('matchhistory').execute(message, args, CLIENT, base_folder);
            break;

        case 'th': // Display the match history of someone
            CLIENT.commands.get('tournamenthistory').execute(message, args, CLIENT, base_folder);
            break;
        
    }
})

CLIENT.login("");