var http = require('http');
var menusJSONURL = (process.env.URL || "http://localhost:3000") + "/menus.json";
var menusJSON;

module.exports = function(robot) {
    robot.respond(/menu/i, function(res) {
        updateMenu(robot, menusJSONURL, function() {
            var target = menusJSON.
            filter(function(menu) {
                return menu.expired !== true;
            })[0];
            var result = displayMenu(target);
            res.send(result);
        })

    })
}

function updateMenu(robot, url, callback) {
    robot.http(url)
        .get()(function(err, res, body) {
            menusJSON = JSON.parse(body)
            callback();
        });
}

function displayMenu(target) {
    var result = [];
    if (target) {
        result.push("訂單編號: " + target.id);
        result.push("餐廳名稱: " + target.restaurant_name);
        result.push("開始時間: " + target.start_time);
        result.push("結束時間: " + target.end_time);
        result.push("點餐連結: " + target.order_url);
        result.push("剩餘時間: " + target.remain_time);

    } else {
        result.push("目前沒有anyone在進行DBD的動作")
    };
    return result.join("\n");
}