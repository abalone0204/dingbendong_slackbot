module.exports = function(robot) {
    robot.hear(/仁甫/i, function (res) {
        res.send("你是指?: http://imgur.com/06zDBEN");
    })
    robot.respond(/slide/i, function  (res) {
        res.send("http://www.slideshare.net/dennyku1/sdbd-52472582");
    })
    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/ding ben dong/i, function(res) {
        res.reply("訂的到便當是一種哲學，訂不到是一種信仰");
    });
}