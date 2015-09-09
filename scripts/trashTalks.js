Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)];
}

var g8ask = ["我想你指的是 ", "你是指: "];
var janeWei = [
    "https://www.filepicker.io/api/file/8B9mCgWORoBMUG6XVyLd",
    "https://www.filepicker.io/api/file/6UAjE7SSmKUKjgMDsCkQ"
];


module.exports = function(robot) {
    robot.hear(/仁甫|自以為綺貞/i, function(res) {
        res.send(g8ask.sample() + janeWei.sample());
    })
    robot.respond(/slide/i, function(res) {
        res.send("http://www.slideshare.net/dennyku1/sdbd-52472582");
    })
    robot.hear(/shit/i, function(res) {
        res.reply("說別人是Shit的人自己才是shit");
    });
    robot.hear(/ding ben dong/i, function(res) {
        res.reply("訂的到便當是一種哲學，訂不到是一種信仰");
    });
}