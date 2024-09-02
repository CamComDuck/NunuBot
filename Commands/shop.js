module.exports = {
    name: 'shop',
    description: 'lets go shopping with CC',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const mongoose = require("mongoose");
        const purchased_items_channel = CLIENT.channels.get('801665706802282527');
        const botconfig = require("C:/Users/"+ base_folder +"/Desktop/Nunu Bot/jsons/botconfig.json")
        mongoose.connect(botconfig.mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const Data = require("C:/Users/"+ base_folder +"/Desktop/Nunu Bot/Models/data.js");

        // #bot-commands
        if (message.channel.id != "768560694035087430" && message.channel.id != "793325534355390464") {
            return message.reply ("This is not the correct channel for bot commands.");
        }

        var user = message.author;
        var correct_num = false;

        var shop_embed = new Discord.RichEmbed()
            .setTitle("Celestial Coin Shop")
            .setColor('#F3DA7D')
            .setDescription("**+shop help** for descriptions and purchasing")
            .setThumbnail("https://cdn.discordapp.com/attachments/793325534355390464/795714887325450300/Celestial_Coin.png")
            .addField("Tournament", "1. **Extra MVP Vote** 50\n2. **Player Prio** 75\n3. **Extra Ban** 150\n10. **Cast 1v1 Tournament** 75", true)
            .addField("Game", "4. **1v1 Staff Member** 100\n5. **1 Hour Coaching** 150\n6. **Skin Stream Vote** 150", true)
            .addField("Creative", "7. **Edit Any Photo** 75\n8. **Create a Graphic** 125\n9. **Edit <1 Minute Vid** 125", true)
            .addField("Roles", "1st price is for 2 months 2nd price is permenant\n**Mercury** 25 | 36\n**Venus** 50 | 67\n**Earth** 75 | 93\n**Mars** 100 | 142\n**Jupiter** 150 | 484", true)
            .setFooter("Fun Fact: The permenant prices for roles are that planet's rounded million of miles from the sun");
        
        var shop_help_embed = new Discord.RichEmbed()
            .setTitle("Celestial Coin Shop Help")
            .setColor('#F3DA7D')
            .setDescription("**+shop** for items available for purchase")
            .setThumbnail("https://cdn.discordapp.com/attachments/793325534355390464/795714887325450300/Celestial_Coin.png")
            .addField("Tournament", "1. One extra one-time-use vote for MVP.\n2. Hat that is picked from before non prio players.\n3. Limit to 1 extra ban per team. Must be communicated what the ban is before champ select starts.\n10. Cast a game in the next 1v1 tournament.", true)
            .addField("Game", "4. 1v1 any staff member of your choosing when they're available.\n5. An hour of coaching from the first available staff/coach.\n6. Have the stream viewers vote on a skin to be gifted to you (under 1k RP).", true)
            .addField("Creative", "7-9. Graphics and videos made by Cam Com, must be SFW content, prices may be negotiated based on work time.", true)
            .addField("Roles", "All roles have a special channel and color. Enter the price of the role you are buying, for example +shop 36 for permanant Mercury", true)
            .addField("Purchasing", "To buy an item, type +shop (item_number). If required, a staff member will respond with any follow up necessary.", true);

        if (!args[1]) { // View purchasable items
            message.channel.send(shop_embed);
        } else if (args[1].toLowerCase() === "help") { // View shop help
            message.channel.send(shop_help_embed);
        } else if (args[1]/args[1] === 1) { // User wants to buy something
            
            Data.findOne ({
                userID: user.id
            }, (err, data) => {
    
                if (err) console.log (err);
                if (!data) {
    
                    var data = new Data ({
                        name: user.username,
                        userID: user.id,
                        lb: "all",
                        money: 0,
                        warns: 0,
                        rank: "All ranks are updated each night",
                        role: "Enter your role with +profile (role)",
                        opgg: "Enter your OP.GG with +profile (opgg)",
                        wins: 0,
                        losses: 0,
                        registered: false,
                        streak: 0,
                        onstreak: false,
                        group: 0
                    })
    
                    data.save().catch(err => console.log(err));
                    return message.reply ("You don't have any Celestial Coins to shop with.");
    
                } else {

                    var item_purchased = "TBD";
                    var item_price = "TBD";

                    var error_embed = new Discord.RichEmbed()
                        .setTitle("An error has occured.")
                        .setDescription("You didn't enter a valid option or didn't have enough Celestial Coins for your transation.\nCurrent balance: " + data.money)
                        .setColor('#d41616')
                        .setFooter("If you believe this is a mistake, please message Cam Com.");

                    var item_purchased_embed = new Discord.RichEmbed()
                        .setTitle("Item Purchased")
                        .setColor('#F3DA7D');

    
                    switch (args[1]) {
                        case "1":
                            correct_num = true;
                            if (data.money < 50) return message.channel.send(error_embed);

                            item_purchased = "Extra MVP Vote";
                            item_price = "50 Celestial Coins";
                            data.money -= 50;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "2":
                            correct_num = true;
                            if (data.money < 75) return message.channel.send(error_embed);

                            item_purchased = "Player Prio";
                            item_price = "75 Celestial Coins";
                            data.money -= 75;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "3":
                            correct_num = true;
                            if (data.money < 150) return message.channel.send(error_embed);

                            item_purchased = "Extra Ban";
                            item_price = "150 Celestial Coins";
                            data.money -= 150;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "4":
                            correct_num = true;
                            if (data.money < 100) return message.channel.send(error_embed);

                            item_purchased = "1v1 Staff Member";
                            item_price = "100 Celestial Coins";
                            data.money -= 100;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "5":
                            correct_num = true;
                            if (data.money < 150) return message.channel.send(error_embed);

                            item_purchased = "1 Hour Coaching";
                            item_price = "150 Celestial Coins";
                            data.money -= 150;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "6":
                            correct_num = true;
                            if (data.money < 150) return message.channel.send(error_embed);

                            item_purchased = "Skin Stream Vote";
                            item_price = "150 Celestial Coins";
                            data.money -= 150;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "7":
                            correct_num = true;
                            if (data.money < 75) return message.channel.send(error_embed);

                            item_purchased = "Edit Any Photo";
                            item_price = "75 Celestial Coins";
                            data.money -= 75;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "8":
                            correct_num = true;
                            if (data.money < 125) return message.channel.send(error_embed);

                            item_purchased = "Create a Graphic";
                            item_price = "125 Celestial Coins";
                            data.money -= 125;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;
                            
                        case "9":
                            correct_num = true;
                            if (data.money < 125) return message.channel.send(error_embed);

                            item_purchased = "Edit <1 Minute Vid";
                            item_price = "125 Celestial Coins";
                            data.money -= 125;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "10":
                            correct_num = true;
                            if (data.money < 75) return message.channel.send(error_embed);

                            item_purchased = "Cast 1v1 Tournament";
                            item_price = "75 Celestial Coins";
                            data.money -= 75;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "25":
                            correct_num = true;
                            if (data.money < 25) return message.channel.send(error_embed);

                            item_purchased = "Mercury Role - 2 Months";
                            item_price = "25 Celestial Coins";
                            data.money -= 25;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "36":
                            correct_num = true;
                            if (data.money < 36) return message.channel.send(error_embed);

                            item_purchased = "Mercury Role - Permanent";
                            item_price = "36 Celestial Coins";
                            data.money -= 36;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "50":
                            correct_num = true;
                            if (data.money < 50) return message.channel.send(error_embed);

                            item_purchased = "Venus Role - 2 Months";
                            item_price = "50 Celestial Coins";
                            data.money -= 50;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "67":
                            correct_num = true;
                            if (data.money < 67) return message.channel.send(error_embed);

                            item_purchased = "Venus Role - Permanent";
                            item_price = "67 Celestial Coins";
                            data.money -= 67;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "75":
                            correct_num = true;
                            if (data.money < 75) return message.channel.send(error_embed);

                            item_purchased = "Earth Role - 2 Months";
                            item_price = "75 Celestial Coins";
                            data.money -= 75;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "93":
                            correct_num = true;
                            if (data.money < 93) return message.channel.send(error_embed);

                            item_purchased = "Earth Role - Permanent";
                            item_price = "93 Celestial Coins";
                            data.money -= 93;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "100":
                            correct_num = true;
                            if (data.money < 100) return message.channel.send(error_embed);

                            item_purchased = "Mars Role - 2 Months";
                            item_price = "100 Celestial Coins";
                            data.money -= 100;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "142":
                            correct_num = true;
                            if (data.money < 142) return message.channel.send(error_embed);

                            item_purchased = "Mars Role - Permanent";
                            item_price = "142 Celestial Coins";
                            data.money -= 142;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "150":
                            correct_num = true;
                            if (data.money < 150) return message.channel.send(error_embed);

                            item_purchased = "Jupiter Role - 2 Months";
                            item_price = "150 Celestial Coins";
                            data.money -= 150;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                        case "484":
                            correct_num = true;
                            if (data.money < 484) return message.channel.send(error_embed);

                            item_purchased = "Jupiter Role - Permanent";
                            item_price = "484 Celestial Coins";
                            data.money -= 484;
                            data.save().catch(err => console.log(err));

                            item_purchased_embed.setDescription("Buyer: " + data.name + "\nPurchased Item: " + item_purchased + "\nPrice: " + item_price + "\nNew Balance: " + data.money)
                            message.channel.send (item_purchased_embed);
                            purchased_items_channel.send (item_purchased_embed);

                            break;

                    }

                    if (correct_num === false) message.channel.send (error_embed);
                
                        
    
                }
            })
        }
    }
}