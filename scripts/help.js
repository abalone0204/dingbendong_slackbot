module.exports = function(robot) {
    var commands = [
            "\ndbder用法：",
            "`@我的名字 指令` : 使用DBD兒就是這麼簡單",
            "example: `@dbder list foods`",
            "============",
            "指令一覽表:",
            "`foods`: 列出所有餐廳名稱及稱號",
            "`show fodd 編號or名稱` : 列出餐廳資訊",
            "`menu` : 看最近的點餐"
        ];
    robot.respond(/info/i, function(res) {
        res.send(commands.join("\n"));
    })
}

