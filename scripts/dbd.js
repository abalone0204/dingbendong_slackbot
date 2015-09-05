var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    var data;
    robot.http(restaurantsJSONURL)
         .get()(function (err, res, body) {
              data = JSON.parse(body)
         });
    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/^dbd$/i ,function (res) {
        res.send("有人叫me嗎?");
    })
    robot.respond(/url/i, function (res) {
        res.send(restaurantsJSONURL);
    });

    robot.respond(/list foods/i, function(res) {
        data.forEach(function (food) {
            res.send(food.name);
        })
        // http.get(restaurantsJSONURL, function(resJSON) {
        //     var body = '';
        //     resJSON.on('data', function(chunk) {
        //         body += chunk;
        //     });
        //     resJSON.on('end', function() {
        //         var fbResponse = JSON.parse(body);
        //         res.reply("Got a response: ");
        //         res.end(function () {
        //             // body... 
        //         })
        //         fbResponse.forEach(function(restaurant) {
        //             res.send(restaurant.name);
        //         })
        //     });
        // }).on('error', function(e) {
        //     res.send("Got an error: ", e);
        // });
    });
}