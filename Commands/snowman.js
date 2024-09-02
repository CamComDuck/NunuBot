module.exports = {
    name: 'snowman',
    description: 'killing mr snowman game',
    execute (message, turned_on, CLIENT, player, base_folder) {
        const Discord = require('discord.js')
        CLIENT.snowman_passwords = require ("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/snowman_passwords.json");
        // if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
        //     return message.reply ("This is not the correct channel for bot commands.");
        // }
        const fs = require("fs");
        const audit_channel = CLIENT.channels.get('794706158476591124');
        const snowman_game_start = new Discord.RichEmbed()
            .setTitle("Mr Snowman's Password Game")
            .setColor('FFFFFF')
            .setDescription("Welcome to Mr Snowman's cave, you must save Mr Snowman by guessing his secret password." +
            "\nWhich list would you like Mr Snowman to pick his password from? Options: Champions, Fruits, Animals")
            .setThumbnail("https://cdn.discordapp.com/attachments/661666436636213250/758877152820199465/Mr_Snowman.png");
        message.channel.send(snowman_game_start);
        CLIENT.on('message', async message=>{
            if (turned_on === false) {
                var snowman_parts = 10;
                var guesses_count = 0;
                var output_phrase = "";
                var win_game = false;
                var correct_letters = ["None"];
                var incorrect_letters = ["None"];
                var snowman_part_names = ["Bottom Snowball", "Middle Snowball", "Right Arm Stick", "Left Arm Stick", "Buttons on Chest",
                    "Bow Tie", "Top Snowball", "Carrot Nose", "Button Eyes", "Top Hat"];
                const filter = message => (!message.author.bot && message.author.id === player);
                turned_on = true;

                var chosen_list_c = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                var chosen_list = chosen_list_c.first().content.toLowerCase();
                if (chosen_list != "champions" && chosen_list != "fruits" && chosen_list != "animals") return message.channel.send ("That isn't an available list.");

                switch(chosen_list) {
                    case 'champions':
                        var random_num = Math.floor((Math.random() * 152) + 1);
                        var secret_phrase = CLIENT.snowman_passwords[random_num].champion.toLowerCase();
                        break;
                    
                    case 'fruits':
                        var random_num = Math.floor((Math.random() * 43) + 153);
                        var secret_phrase = CLIENT.snowman_passwords[random_num].food.toLowerCase();
                        break;

                    case 'animals':
                        var random_num = Math.floor((Math.random() * 94) + 197);
                        var secret_phrase = CLIENT.snowman_passwords[random_num].animal.toLowerCase();
                        break;
                }
                
                //console.log(secret_phrase);
                for (var i = 0 ; i < secret_phrase.length ; i++){
                    if (secret_phrase[i] === " "){
                        output_phrase += " "
                    } else {
                        output_phrase += "-";
                    }
                }

                const snowman_game = new Discord.RichEmbed()
                    .setTitle("Mr Snowman's Password Game")
                    .setColor('FFFFFF')
                    .setThumbnail("https://cdn.discordapp.com/attachments/661666436636213250/758877152820199465/Mr_Snowman.png");

                while (snowman_parts > 0 && win_game === false) { // Start game

                    var found_letter = false;
                    var letters_found = 0;

                    snowman_game.setDescription
                        ("**Mr Snowman's password:** " + output_phrase + 
                        "\n**Mr Snowman's remaining parts:** " + snowman_part_names.slice(0, snowman_parts) + 
                        "\n**Correct letters guessed:** " + correct_letters.join(",") +
                        "\n**Incorrect letters guessed:** " + incorrect_letters.join(","))
                    .setFooter("You have " + snowman_parts + " parts left. Enter a letter to guess!");
                    message.channel.send(snowman_game);
                    
                    var guessed_letter_c = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var guessed_letter = guessed_letter_c.first().content.toLowerCase();

                    if (guessed_letter === "die") { // Insta kill
                        snowman_parts = 0;

                    } else if (guessed_letter === secret_phrase) { // Check if user has guessed entire password
                        win_game = true;
                    } else {
                        while (guessed_letter.length != 1 || correct_letters.includes(" " + guessed_letter) || incorrect_letters.includes(" " + guessed_letter)) {
                            // guessed letter isn't 1 character or was already guessed
                            guessed_letter = message.channel.send("Thats not a letter or its a letter you already entered! Try again:");
                            guessed_letter_c = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                            guessed_letter = guessed_letter_c.first().content.toLowerCase();
                            if (guessed_letter === secret_phrase) {
                                win_game = true;
                                break;
                            }
                        }

                        for (let o = 0; o<secret_phrase.length; o++) { // check if guessed letter is in password
                            if (secret_phrase[o] === guessed_letter) {
                                letters_found += 1;
                                found_letter = true;
                                output_phrase = output_phrase.slice(0,o) + secret_phrase[o] + output_phrase.slice(o+1);
                            }
                        }

                        if (found_letter === false && win_game === false) { // guessed letter isn't in password
                            snowman_parts -= 1;
                            incorrect_letters.push(" " + guessed_letter);
                            message.channel.send ("Your guess '" + guessed_letter + "' wasn't correct.")
                        } else if (found_letter === true && win_game === false) { // guessed letter is in password
                            correct_letters.push(" " + guessed_letter);
                            message.channel.send("You found "+ letters_found + " '" + guessed_letter + "' in Mr Snowman's password!")
                        }

                        if (output_phrase == secret_phrase) { // check if user has guessed the password
                            win_game = true;
                        }

                        if (correct_letters.length === 2 && correct_letters[0] === "None") correct_letters.splice(0,1);
                        if (incorrect_letters.length === 2 && incorrect_letters[0]=== "None") incorrect_letters.splice(0,1);
                    }

                        guesses_count += 1;
                }

                
                if (snowman_parts == 0) { // Player lost the game
                    const snowman_game_loss = new Discord.RichEmbed()
                        .setTitle("Mr Snowman's Password Game")
                        .setColor('FFFFFF')
                        .setDescription("You couldn't guess Mr Snowman's password before he died. His password was '" + secret_phrase +
                        "'\nYou took " + guesses_count + " guesses to kill Mr Snowman.")
                        .setThumbnail("https://cdn.discordapp.com/attachments/661666436636213250/758877152820199465/Mr_Snowman.png");
                    message.channel.send(snowman_game_loss);

                    const audit_embed = new Discord.RichEmbed()
                        .setTitle("Snowman Command")
                        .setColor('78b159')
                        .setDescription("Command user: " + message.author.username + "\nSnowman Parts Left: " + snowman_parts);
                    audit_channel.send(audit_embed);

                } else { // Player won the game
                    const snowman_game_win = new Discord.RichEmbed()
                        .setTitle("Mr Snowman's Password Game")
                        .setColor('FFFFFF')
                        .setDescription("You saved Mr Snowman! His password is '" + secret_phrase+ "'. You took " + guesses_count + " guesses to save Mr Snowman.")
                        .setThumbnail("https://cdn.discordapp.com/attachments/661666436636213250/758877152820199465/Mr_Snowman.png");
                    message.channel.send(snowman_game_win);

                    const audit_embed = new Discord.RichEmbed()
                        .setTitle("Snowman Command")
                        .setColor('78b159')
                        .setDescription("Command user: " + message.author.username + "\nSnowman Parts Left: " + snowman_parts);
                    audit_channel.send(audit_embed);
                }
            }
            return;
        })
    }
}