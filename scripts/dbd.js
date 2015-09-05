var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    var data;
    robot.http(restaurantsJSONURL)
        .get()(function(err, res, body) {
            data = JSON.parse(body)
        });

    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/^dbd$/i, function(res) {
        res.send("有人叫me嗎?");
    })
    robot.respond(/url/i, function(res) {
        res.send(restaurantsJSONURL);
    });

    robot.respond(/list foods/i, function(res) {
        var result = ""
        data.forEach(function(food, i) {
            result += (i + 1) + ". " + food.name + "\n";
        })
        res.send(result);
    });

    robot.respond(/show food (\d+)/, function(res) {
        var result = [];
        var restIndex = res.match[1] - 1;
        var target = data[restIndex]
        if (target) {
            result.push("餐廳名稱: " + target.name);
            result.push("電話: " + target.phone);
            if (target.introduction) {
                result.push("簡介: " + target.introduction);
            };
            result.push("菜單");
            result.push(target.filepicker_url);
            res.send(result.join("\n"));
        } else {
            res.send("404 找不到你要的餐廳 哭哭喔 :crydenny:")
        };
    })
}