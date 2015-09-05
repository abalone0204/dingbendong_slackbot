module.exports = function(robot) {
    var commands = [
            "show foods list : 列出所有餐廳名稱及稱號",
            "show fodd 編號or名稱 : 列出餐廳資訊"
        ];
    robot.respond(/info/i, function(res) {
        res.send(commands.join("\n"));
    })
}