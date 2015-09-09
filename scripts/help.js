var defaultURL = process.env.URL || "http://localhost:3000/";
module.exports = function(robot) {
    var commands = [
            "dbder用法：",
            "`sudo 指令` : 不用tag",
            "`@dbder 指令` : 使喚DBD兒就是這麼簡單",
            "example: ",
            "`  1. @dbder foods`",
            "`  2. sudo foods`",
            "",
            "指令一覽表:",
            "`web` : 網頁版網址",
            "`foods`: 列出所有餐廳名稱及稱號",
            "`food 編號or名稱` : 列出餐廳資訊",
            "`menu` : 看最近的點餐",
            "`menus` : 看目前有的點餐",
            "`menu 編號` : 查看編號的menu資訊",
            "`bills` :  查詢最近5筆帳單",
            "`bill 帳單編號` : 查詢該筆編號的帳單資訊",
            "`bill` : 最新的帳單"
        ];
    robot.hear(/^sudo info/i, function(res) {
        res.send(commands.join("\n"));
    })    
    robot.respond(/info/i, function(res) {
        res.send(commands.join("\n"));
    })
    robot.hear(/^sudo url/i, function(res) {
        res.send("DBD網頁版\n"+defaultURL);
    })
    robot.respond(/web/i, function (res) {
        res.send("DBD網頁版\n"+defaultURL);
    })
}

