var defaultURL = process.env.URL || "http://localhost:3000/";
module.exports = function(robot) {
    var commands = [
            "dbder用法：",
            "`@dbder 指令` : 使喚DBD兒就是這麼簡單",
            "example: `@dbder foods`",
            "",
            "指令一覽表:",
            "`web` : 網頁版網址",
            "`foods`: 列出所有餐廳名稱及稱號",
            "`show food 編號or名稱` : 列出餐廳資訊",
            "`menu` : 看最近的點餐",
            "`all menus` : 看目前有的點餐",
            "`show menu 編號 : 查看編號的menu資訊",
            "`bill` : 最新的帳單"
        ];
    robot.respond(/info/i, function(res) {
        res.send(commands.join("\n"));
    })
    robot.respond(/web/i, function (res) {
        res.send("DBD網頁版\n"+defaultURL);
    })
}

