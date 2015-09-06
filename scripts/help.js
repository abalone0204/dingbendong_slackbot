module.exports = function(robot) {
    var commands = [
            "dbder用法：",
            "`@dbder 指令` : 使用DBD兒就是這麼簡單",
            "example: `@dbder foods`",
            "============",
            "指令一覽表:",
            "`foods`: 列出所有餐廳名稱及稱號",
            "`show food 編號or名稱` : 列出餐廳資訊",
            "`menu` : 看最近的點餐",
            "`bill` : 最新的帳單"
        ];
    robot.respond(/info/i, function(res) {
        res.send(commands.join("\n"));
    })
}

