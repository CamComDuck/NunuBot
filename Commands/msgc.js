module.exports = {
    name: 'msgc',
    description: 'count discord messages',
    execute (message, args, CLIENT, base_folder) {
        const Discord = require('discord.js');
        const fs = require("fs");
        var path = require('path');
        var process = require("process");
        var csvReader = require('csv-reader');

        // CLIENT.msgFolder = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/discord_package/messages");
        // var msgFolderJSON = Object.entries(CLIENT.msgFolder);
        // console.log(msgFolderJSON[0])
        // console.log(msgFolderJSON.length);
        // CLIENT.channelFolder = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/discord_package/messages/c243194443157471233/channel.json");
        // console.log(CLIENT.channelFolder)

        function getBanCountingArray(arrayBName) {
            var fb_list = arrayBName;
            var fb_list_f = [];
          
            fb_list.sort();
            var fb_counter = 1;
            var fb_list_f = []
            var current_fb = "";
          
            for (var t = 0; t < fb_list.length; t++) {
                if (t === 0) { // First
                  current_fb = fb_list[0];
                } else if (t === ((fb_list.length)-1)) { // Last
          
                  if (fb_list[t] === current_fb) {
                    fb_counter += 1;
                  } else {
                    fb_list_f.push(fb_counter + "|" + current_fb);
                    current_fb = fb_list[t];
                    fb_counter = 1;
                  }
                      
                  fb_list_f.push(fb_counter + "|" + current_fb);
          
                } else if (fb_list[t] === current_fb) { // Same
                  fb_counter += 1;
                } else { // Different
                  fb_list_f.push(fb_counter + "|" + current_fb);
                  current_fb = fb_list[t];
                  fb_counter = 1;
                }
            }
          
            fb_list_f.sort();
            fb_list_f.reverse();
          
            // Ban FINAL ARRAY SORTER
            fb_list_f.sort(function(a,b){
                if(parseFloat(a.split("|")[0]) === parseFloat(b.split("|")[0])) {
                  return parseFloat(b.split("|")[0]) - parseFloat(a.split("|")[0]);
                } else if(parseFloat(a.split("|")[0]) > parseFloat(b.split("|")[0])) {
                  return -1;
                }  
                return 1;
            });
            return fb_list_f;
          }

        // Create Champion Output Array \\
        function getCFinalArray(arrayCOName) {
            var kill_list_f = arrayCOName;
            var fkillList = [];
            
            for (var i = 0; i < kill_list_f.length; i++) {
                var kill_list_fs = kill_list_f[i].split("|");
                fkillList.push(kill_list_fs);
            }
            return fkillList;
        }


        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        CLIENT.msgIndex = require("C:/Users/"+base_folder+"/Desktop/Nunu Bot/discord_package/messages/index.json");
        var msgIndexJSON = Object.entries(CLIENT.msgIndex);
        var moveFrom = "C:/Users/"+base_folder+"/Desktop/Nunu Bot/discord_package/messages";
        var channel_names = [];
        var msg_count = [];
        var combined_array = [];
        var all_words = [];

        async function loopFiles () {

            await fs.readdir(moveFrom, function (err, files) {
                if (err) {
                    console.error("Could not list the directory.", err);
                    process.exit(1);
                }
    
                files.forEach(function (file, index) {
                    // Make one pass and make the file complete
                    var fromPath = path.join(moveFrom, file);
    
                    fs.stat(fromPath, function (error, stat) {
                        if (error) {
                            console.error("Error stating file.", error);
                            return;
                        }
    
                        if (stat.isDirectory()) {
                            CLIENT.channelFolder = require(moveFrom + "/" + file + "/channel.json");
                            var current_array = ["", ""];
    
                            if (CLIENT.channelFolder["type"] === 0) { // Server channel
                                // console.log(CLIENT.channelFolder)
                                try {
                                    channel_names.push(CLIENT.channelFolder["guild"]["name"] + " | " + CLIENT.channelFolder["name"])
                                    current_array[0] = CLIENT.channelFolder["guild"]["name"] + " | " + CLIENT.channelFolder["name"]
                                } catch (err) {
                                    return;
                                }
                                
                            } else if (CLIENT.channelFolder["type"] === 1) { // DM
                                // console.log(msgIndexJSON[CLIENT.channelFolder["id"]])
                                channel_names.push(CLIENT.channelFolder["id"])
                                for (var i = 0; i < msgIndexJSON.length; i++) {
                                    if (msgIndexJSON[i][0] === CLIENT.channelFolder["id"]) {
                                        current_array[0] = msgIndexJSON[i][1]
                                        i = msgIndexJSON.length;
                                    }
                                }
                            } else if (CLIENT.channelFolder["type"] === 3) { // DM Group
                                channel_names.push(CLIENT.channelFolder["name"])
                                current_array[0] = CLIENT.channelFolder["name"]
                            }
    
                            var inputFile = fs.createReadStream(moveFrom + "/" + file + "/messages.csv", "utf8") 
                            var loadedData = [];
                            inputFile.pipe(new csvReader ({
                                parseNumbers: true,
                                skipHeader: true,
                                parseBooleans: true})).on('data', function(row) {
                                    loadedData.push(row);
                                }).on('end',function() {
                                    for (var o = 0; o < loadedData.length; o++) {
                                        // console.log(loadedData[o][2])
                                        // var current_msg1 = loadedData[o][2].toString().toLowerCase() ;
                                        // var current_msg = current_msg1.split(" ");

                                        var current_time1 = loadedData[o][1];
                                        var current_time2 = current_time1.split(" ");
                                        var current_time3 = current_time2[1].split(":")
                                        all_words.push(parseInt(current_time3[0])-4)

                                        // for (var n = 0; n < current_msg.length; n++) {
                                        //     all_words.push(current_msg[n])
                                        // }
                                    }
                                    
                                    msg_count.push(loadedData.length);
                                    current_array[1] = loadedData.length
                                })
                        }
                        
                        combined_array.push(current_array);
                        
                    });
                });
            });

            await sleep(5000);
            // console.log(combined_array)
            var counted_words = getBanCountingArray(all_words)
            var counted_words2 = getCFinalArray(counted_words)
            console.log(counted_words2)
            CLIENT.reading_code = counted_words2;
            fs.writeFile("C:/Users/"+base_folder+"/Desktop/Nunu Bot/jsons/reading_code.json", JSON.stringify (CLIENT.reading_code, null, 4), err => {
                if (err) throw err;
            })
        }

        loopFiles();
        
        

    }
}