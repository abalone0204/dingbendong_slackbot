var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/^dbd$/i, function(res) {
        res.send("有人叫me嗎?");
    })
}