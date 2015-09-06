var http = require('http');
var defaultURL = process.env.URL || "http://localhost:3000/";
var menusJSONURL = defaultURL + "/menus.json";

var menusJSON;

module.exports = function(robot) {
    robot.respond(/bill/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var latestMenuId = menusJSON.
            filter(function(menu) {
                return menu.expired === true;
            }).
            reduce(function(curr, acc) {
                if (new Date(curr.raw_end_time) < new Date(acc.raw_end_time)) {
                    return acc;
                } else {
                    return curr;
                }
            }).id;

            var billJSONURL = defaultURL + "/menus/" + latestMenuId + "/bill.json"

            robot.http(billJSONURL)
                .get()(function(err, response, body) {
                    var billJSON = JSON.parse(body)
                    var result = displayOrder(billJSON)
                    res.send(result);
                });

        });
    });
    robot.respond(/all menus/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var targets = menusJSON.
            filter(function(menu) {
                return menu.expired !== true;
            })
            var result = targets.
            map(function(menu) {
                return "訂單編號:"+menu.id+" "+menu.restaurant_name+" 還有"+menu.remain_time+"截止"
            })
            if (result.length === 0) {
                result.push("目前沒有人DBD喔!");
            };
            res.send(result.join("\n"));
        })
    })
    robot.respond(/menu/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var target = menusJSON.
            filter(function(menu) {
                return menu.expired !== true;
            })[0];
            var result = displayMenu(target);
            res.send(result);
        });
    })
    
    robot.respond(/show menu (\d+)/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var menuID = parseInt(res.match[1]);
            var target = menusJSON.
            filter(function(menu) {
                return menu.id === menuID;
            })[0]
            var result = displayMenu(target);
            res.send(result);
        })
    })
}


function updateJSON(robot, url, callback) {
    robot.http(url)
        .get()(function(err, res, body) {
            menusJSON = JSON.parse(body)
            callback();
        });
}

function displayMenu(target) {
    var result = [];
    
    if (target) {
        result.push("```");
        result.push("訂單編號: " + target.id);
        result.push("餐廳名稱: " + target.restaurant_name);
        result.push("開始時間: " + target.start_time);
        result.push("結束時間: " + target.end_time);
        result.push("點餐連結: " + target.order_url);
        result.push("剩餘時間: " + target.remain_time);
        result.push("```");
    } else {
        result.push("目前沒有anyone在進行DBD的動作")
    };
    
    return result.join("\n");
}

function displayMenus(targets) {

}

function displayOrder(billJSON) {
    var result = [];
    result.push("```");
    if (billJSON.id) {
        result.push("訂單編號 : " + billJSON.id);
        result.push("訂餐DRI :" + billJSON.user.name);
        result.push("餐廳 : " + billJSON.restaurant_name);
        result.push("");
        billJSON.orders.forEach(function(order) {
            var orderStr = ""
            orderStr += order.ordere_name + " ";
            orderStr += order.food_name + " ";
            orderStr += order.price + " ";
            orderStr += order.has_paid ?  "已付款" : "尚未付款";
            result.push(orderStr)
        })
        var total = billJSON.orders.
        map(function(order) {
            return order.price;
        }).
        reduce(function(prev, curr) {
            curr += prev;
            return curr;
        }, 0)
        var residual = billJSON.orders.
        filter(function(order) {
            return order.has_paid === false;
        }).map(function(order) {
            return order.price;
        }).
        reduce(function(prev, curr) {
            curr += prev;
            return curr;
        }, 0)
        result.push("");
        result.push("總計 : " + total);
        result.push("目前還缺多少錢 : " + residual);
        result.push("網頁版連結 : " + defaultURL + "menus/" + billJSON.id + "/bill");
    } else {
        result.push("目前沒有點菜單需要結帳")
    };
    result.push("```");
    return result.join("\n");
}