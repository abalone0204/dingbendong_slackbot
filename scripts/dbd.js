var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    robot.hear(/shit/i, function(res) {
        res.send("說別人是Shit的人自己才是shit");
    });
    robot.hear(/^dbd$/i ,function (res) {
        res.send("有人叫me嗎?");
    })
    robot.respond(/url/i, function (res) {
        res.send(restaurantsJSONURL);
    });

    robot.respond(/list foods/i, function(res) {
        res.send("start to list foods..");
        http.get(restaurantsJSONURL, function(resJSON) {
            var body = '';
            resJSON.on('data', function(chunk) {
                body += chunk;
            });
            resJSON.on('end', function() {
                var fbResponse = JSON.parse(body);
                res.reply("Got a response: ");
                fbResponse.forEach(function(restaurant) {
                    res.send(restaurant.name);
                })
            });
        }).on('error', function(e) {
            res.send("Got an error: ", e);
        });
    });
}