var http = require('http');
var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
module.exports = function(robot) {
    var data;
    robot.http(restaurantsJSONURL)
        .get()(function(err, res, body) {
            data = JSON.parse(body)
        });
    robot.respond(/url/i, function(res) {
        res.send(restaurantsJSONURL);
    });

    robot.respond(/list foods/i, function(res) {
        var result = ""
        data.forEach(function(food, i) {
            result += (i + 1) + ". " + food.name + "\n";
        })
        res.send(result);
    });
    robot.respond(/show food (\d+)$/i, function(res) {
        var restIndex = res.match[1] - 1;
        var target = data[restIndex]
        var result = displayRestaurant(target);
        res.send(result);
    });
    robot.respond(/show food (\d{0,}[\WA-Za-z]+\d{0,})/i, function(res) {
        var result = "";
        var searchText = res.match[1];
        var matchedRestaurants = data.filter(function(restaurant) {
            return restaurant.name.match(searchText) !== null;
        });
        if (matchedRestaurants.length > 1) {
            result = multipleRestaurants(matchedRestaurants);
        } else {
            result = displayRestaurant(matchedRestaurants[0])
        };
        res.send(result);
    })
}

function displayRestaurant(target) {
    var result = []
    if (target) {
        result.push("餐廳名稱: " + target.name);
        result.push("電話: " + target.phone);
        if (target.introduction) {
            result.push("簡介: " + target.introduction);
        };
        result.push("菜單");
        result.push(target.filepicker_url);
    } else {
        result.push("404 找不到你要的餐廳 哭哭喔 :crydenny:");
    }
    return result.join("\n");
}

function multipleRestaurants (targets) {
    return "你可能在找... \n"+targets.map(function (target) {
        return "          "+target.name
    }).join("\n")
}