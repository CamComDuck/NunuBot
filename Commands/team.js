module.exports = {
    name: 'team',
    description: 'registering a team for KVD',
    execute (CLIENT, Discord, message, blacklisted) {
        // Creating Tutorial
        const createbeds = new Discord.RichEmbed().setTitle("Knights Vow Registration").setColor('#F77932')
        const createerrorbeds = new Discord.RichEmbed().setTitle("Knights Vow Registration Error").setColor('#ff0000')
        const errorstep = createerrorbeds.setDescription("There was en error with your input. Please try the same step again.\nIf you think this error is wrong, please ping Cam Com.").addField("Possible Errors:", 
            "More than 30 characters\nMore than 1 ping\nPinged same person for both players\nPlayer is already registered for a team\nMore than just the number for rank brakcet\nA simple typo");
        var isthisthingon = 0;
        const firststep = createbeds.setDescription("Welcome to the registration for the Knight's Vow Duel! Nunu Bot will take you through the quick registration process.\nYou do not need to use + for the remainder of this process.\nFirstly, please enter your team name. Must be less than or equal to 30 characters.\nIf you would like to close the bot at any point during registration, type +close.");
        message.channel.send(firststep);

        // User Registration
        CLIENT.on('message', async message=>{
            const destination = CLIENT.channels.get('750445210299007039');
            const destinationmanage = CLIENT.channels.get('751123494162661466');
            const filter = message => !message.author.bot
            if (isthisthingon === 0) {
                isthisthingon = 1;

                // Assign team name
                
                let teamc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                var teamn = ((teamc.first().content)[0].toUpperCase())+(teamc.first().content).slice(1);
                var teamnl = teamn.length;
                

                // Check team name is less than 30 characters and doesn't include blacklisted
                for (var i in blacklisted) {
                    while (teamn.includes(blacklisted[i]) || teamnl > 30 && isthisthingon === 1) {
                        message.channel.send(errorstep);
                        let teamc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var teamn = ((teamc.first().content)[0].toUpperCase())+(teamc.first().content).slice(1);
                        var teamnl = teamn.length;
                    }
                }



                if (isthisthingon === 1) {
                // Assign player 1 name
                    const secondstep = createbeds.setDescription("Your team name: " + teamn + ".\nPlease ping your first player.");
                    message.channel.send(secondstep);
                    let playeroc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var player1 = playeroc.first().content;
                    var player1l = player1.length;
                

                // Check there was one ping
                    while (player1[1] !== "@" && isthisthingon === 1) {
                        message.channel.send(errorstep);
                        let playeroc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var player1 = playeroc.first().content;
                        var player1l = player1.length;
                    }
                }



                if (isthisthingon === 1) {
                    // Assign player 2 name
                    const thirdstep = createbeds.setDescription("Your first player: " + player1 + ".\nPlease ping your second player.");
                    message.channel.send(thirdstep);
                    let playertc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var player2 = playertc.first().content;
                    var player2l = player2.length;

                    // Check there was one ping
                    while (player2 === player1 || player2[1] !== "@" && isthisthingon === 1) {
                        message.channel.send(errorstep);
                        let playertc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var player2 = playertc.first().content;
                        var player2l = player2.length;
                    }
                }
                


                if (isthisthingon === 1) {
                    // Assign region
                    const fourthstep = createbeds.setDescription("Your second player: " + player2 + ".\nWhat region is your team?\n\n**Options**:\nNA\nEUW\nBoth");
                    message.channel.send(fourthstep);
                    let regionc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var region = (regionc.first().content).toUpperCase();

                    // Check for correct region
                    while (region !== "NA" && region !== "EUW" && region !== "BOTH" && isthisthingon === 1) {
                        message.channel.send(errorstep);
                        let regionc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var region = (regionc.first().content).toUpperCase();
                    }
                    if (region === "BOTH") {region = "NA & EUW";}
                }



                // Assign player IGNs if they are in 1 region        

                if (isthisthingon === 1) {
                    // Assign first player IGN
                    const tenthstep = createbeds.setDescription("Your region: " + region + ".\nWhat is your first player's IGN?\nAll IGNs must be less than or equal to 30 characters\nIf you selected both regions, enter your NA ign first");
                    message.channel.send(tenthstep)
                    let player1ignc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var player1ign = player1ignc.first().content;
                    var player1ignl = player1ign.length;

                    // Check first player IGN is less than 30 characters and doesn't include blacklisted
                    for (var i in blacklisted) {
                        while (player1ign.includes(blacklisted[i]) || player1ignl > 30 && isthisthingon === 1) {
                            message.channel.send(errorstep);
                            let player1ignc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                            var player1ign = player1ignc.first().content;
                            var player1ignl = player1ign.length;
                        }
                    }
                }

                if (isthisthingon === 1) {
                    // Assign second player IGN
                    const eleventhstep = createbeds.setDescription("Your first player's IGN: " + player1ign + ".\nWhat is your second player's IGN?\nIf you selected both regions, enter your NA ign first");
                    message.channel.send(eleventhstep)
                    let player2ignc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var player2ign = player2ignc.first().content;
                    var player2ignl = player2ign.length;

                    // Check second player IGN is less than 30 characters and doesn't include blacklisted
                    for (var i in blacklisted) {
                        while (player1ign.includes(blacklisted[i]) || player2ignl > 30 && isthisthingon === 1) {
                            message.channel.send(errorstep);
                            let player2ignc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                            var player2ign = player2ignc.first().content;
                            var player2ignl = player2ign.length;
                        }
                    }
                }

                if (isthisthingon === 1) {
                    var player1igneuw = "[Not playing in both regions]";
                    var player2igneuw = "[Not playing in both regions]";

                    // Assign player IGNs if they are in both regions 
                    if (region === "NA & EUW") {
                        
                        // Assign first player EUW IGN
                        const twelfthstep = createbeds.setDescription("Your second player's IGN: " + player2ign + ".\nWhat is your first player's EUW IGN?");
                        message.channel.send(twelfthstep)
                        let player1igneuwc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var player1igneuw = player1igneuwc.first().content;
                        var player1igneuwl = player1igneuw.length;

                        // Check first player EUW IGN is less than 30 characters and doesn't include blacklisted
                        for (var i in blacklisted) {
                            while (player1igneuw.includes(blacklisted[i]) || player1igneuwl > 30 && isthisthingon === 1) {
                                message.channel.send(errorstep);
                                let player1igneuwc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                                var player1igneuw = player1igneuwc.first().content;
                                var player1igneuwl = player1igneuw.length;
                            }
                        }
                    

                        // Assign second player EUW IGN
                        const thirteenthstep = createbeds.setDescription("Your first player's EUW IGN: " + player1igneuw + ".\nWhat is your second player's EUW IGN?");
                        message.channel.send(thirteenthstep)
                        let player2igneuwc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var player2igneuw = player2igneuwc.first().content;
                        var player2igneuwl = player2igneuw.length;

                        // Check second player EUW IGN is less than 30 characters and doesn't include blacklisted
                        for (var i in blacklisted) {
                            while (player2igneuw.includes(blacklisted[i]) || player2igneuwl > 30 && isthisthingon === 1) {
                                message.channel.send(errorstep);
                                let player2igneuwc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                                var player2igneuw = player2igneuwc.first().content;
                                var player2igneuwl = player2igneuw.length;
                            }
                        }
                    }
                }
                    



                if (isthisthingon === 1) {
                    // Assign rank bracket
                    const fifthstep = createbeds.setDescription("Your second player's IGN: " + player2ign +".\nYour second player's second IGN (if applicable): " + player2igneuw + ".\nWhat rank bracket is your team?\n\n**Options:**\nSilver & Below - Type 1\nGold & Plat - Type 2\nDiamond & Above - Type 3");
                    message.channel.send(fifthstep);
                    let rankc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                    var rank = rankc.first().content;

                    // Check for correct rank
                    while (rank !== "1" && rank !== "2" && rank !== "3" && isthisthingon === 1) {
                        message.channel.send(errorstep);
                        let rankc = await message.channel.awaitMessages(filter, { maxMatches: 1 });
                        var rank = rankc.first().content;
                    }
                    if (rank === "1") {
                        rank = "Silver & Below";
                    } else if (rank === "2") {
                        rank = "Gold & Plat";
                    } else if (rank === "3") {
                        rank = "Diamond & Above";
                    }
                }



                if (isthisthingon === 1) {
                    // Final thanks and team creation
                    const finalstep = createbeds.setDescription("Your rank bracket: " +rank + ".\nThanks for registering for the Knights Vow Duel!\nYour team should be displayed in #teams\nIf any info is incorrect or you wish to change something feel free to ping Cam Com.\nGLHF competing!");
                    message.channel.send(finalstep);

                    const finalteam = new Discord.RichEmbed()
                        .setTitle(teamn)
                        .setColor('#F77932')
                        .addField("Player 1", "> " + player1 + "\n" + "> " + player1ign + "\n" + "> " + player1igneuw, true)
                        .addField("Player 2", "> " +player2 + "\n" + "> " + player2ign + "\n" + "> " + player2igneuw, true)
                        .addField('Region: ', '> ' + region, true)
                        .addField('Rank Category: ', '> ' + rank, true)
                        .setThumbnail(message.author.displayAvatarURL);
                    destination.send(finalteam);

                    const manageteam = new Discord.RichEmbed()
                        .setTitle(teamn + " for management")
                        .setColor('#F77932')
                        .addField("Player 1", "> " + player1 + "\n" + "> " + player1ign + "\n" + "> " + player1igneuw, true)
                        .addField("Player 2", "> " +player2 + "\n" + "> " + player2ign + "\n" + "> " + player2igneuw, true)
                        .addField('Region: ', '> ' + region, true)
                        .addField('Rank Category: ', '> ' + rank, true);
                    destinationmanage.send(manageteam);
                    console.log ("Registration complete");

                    isthisthingon = 0;
                }
            }

        })
    }
}
