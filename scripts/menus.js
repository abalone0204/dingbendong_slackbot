var http = require('http');
var defaultURL = process.env.URL || "http://localhost:3000/";
var menusJSONURL = defaultURL + "/menus.json";

var menusJSON;

Array.prototype.take = function(num) {
    return this.splice(0, num);
};

module.exports = function(robot) {
    robot.respond(/all bills/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var result = [];
            var recentBills = menusJSON.
            filter(function(menu) {
                return menu.expired === true;
            }).reverse().take(5);
            console.log(recentBills);
            recentBills.
            forEach(function(recentBill) {
                result.push("編號: "+recentBill.id + recentBill.restaurant_name+ " 已經結束: "+recentBill.remain_time.replace("-",""))
            });
            res.send(result.join("\n"));
        });
    });
    robot.respond(/show bill (\d+)/i, function(res) {
        updateJSON(robot, menusJSONURL, function() {
            var matchIndex = parseInt(res.match[1]);            
            var billJSONURL = defaultURL + "/menus/" + matchIndex + "/bill.json"
            robot.http(billJSONURL)
                .get()(function(err, response, body) {
                    var billJSON = JSON.parse(body)
                    var result = displayOrder(billJSON)
                    res.send(result);
                });
        });

    });
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
            // var result = displayBill(robot, latestMenuId);
            // res.send(result);
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
                return "訂單編號:" + menu.id + " " + menu.restaurant_name + " 還有" + menu.remain_time + "截止"
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


function displayOrder(billJSON) {
    var orders = billJSON.orders;
    var orderNames = [];
    orders.forEach(function(order) {
        if (orderNames.indexOf(order.food_name) === -1) {
            orderNames.push(order.food_name);
        };
    });
    var totalClassify = orderNames.
    map(function(orderName) {
        return {
            orderName: orderName,
            count: orders.filter(function(order) {
                return order.food_name === orderName;
            }).length,
            price: orders.reduce(function(prev, curr) {
                return curr.food_name === orderName ? curr : prev;
            }).price,
            total: orders.filter(function(order) {
                return order.food_name === orderName;
            }).
            map(function(matchedOrder) {
                return parseInt(matchedOrder.price);
            }).
            filter(function(price) {
                return isNaN(price) !== true;
            }).
            reduce(function(prev, curr) {
                curr += prev
                return curr;
            }, 0)
        }
    })
    var result = [];
    result.push("```");
    if (billJSON.id) {
        result.push("訂單編號 : " + billJSON.id);
        result.push("訂餐DRI :" + billJSON.user.name);
        result.push("餐廳 : " + billJSON.restaurant_name);
        result.push("餐廳電話 : "+billJSON.restaurant_phone_number);
        result.push("");
        result.push("訂餐清單 :")
        totalClassify.forEach(function(tc) {
            var clStr = "";
            clStr += tc.orderName + " " + tc.price + "元" + " * " + tc.count + " = " + tc.total;
            result.push(clStr);
        })
        result.push("");
        result.push("明細 :");
        billJSON.orders.
        forEach(function(order) {
            var orderStr = ""
            orderStr += order.ordere_name + " ";
            orderStr += order.food_name + " ";
            orderStr += "$" + order.price + " ";
            if (order.note !== "") orderStr += "[備註: " + order.note + "] ";
            orderStr += order.has_paid ? "已付款" : "尚未付款";
            if (!order.has_paid) orderStr += " -> 找錢 " + order.change;
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
    result.push("防呆小提醒: ");
    result.push("如果這不是你要找的訂單，\n請對我輸入 all bills \n(或者是在你所在地channel中輸入 @dbder: all bills)\n找到你想查詢的編號以後，再輸入 show bill 帳單編號 \n來看目前有哪些帳單");
    result.push("```");
    return result.join("\n");
}