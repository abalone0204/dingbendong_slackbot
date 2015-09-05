var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/ding ben dong/i, function(res) {
        res.reply("訂的到便當是一種哲學，訂不到是一種信仰");
    });
}