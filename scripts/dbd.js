var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000")+"/restaurants.json"
module.exports = function(robot) {
    robot.hear(/shit/i, function (res) {
        res.send("Shit!")
    });
    robot.respond(/list foods/i, function(res) {
        http.get(restaurantsJSONURL, function(resJSON) {
            var body = '';
            resJSON.on('data', function(chunk) {
                body += chunk;
            });
            resJSON.on('end', function() {
                var fbResponse = JSON.parse(body);
                res.reply("Got a response: ");
                fbResponse.forEach(function (restaurant) {
                    res.send(restaurant.name);    
                })
            });
        })
    });
}