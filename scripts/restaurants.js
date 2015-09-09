var restaurantsJSONURL = (process.env.URL || "http://localhost:3000") + "/restaurants.json"
var restaurantsJSON;
var http = require('http');
module.exports = function(robot) {
    robot.respond(/resurl/i, function(res) {
        res.send(restaurantsJSONURL);
    });
    robot.hear(/sudo foods/i, function(res) {
        sendFoods(robot, res);
    });

    robot.respond(/foods/i, function(res) {
        sendFoods(robot, res);
    });
    robot.hear(/sudo food[^s]* (\d+)/i, function(res) {
        sendFood(robot, res);
    })
    robot.respond(/food[^s]* (\d+)$/i, function(res) {
        sendFood(robot, res);
    });

    robot.hear(/sudo food (\d{0,}[\WA-Za-z]+\d{0,})/i, function(res) {
        sendFood(robot, res);
    })
    robot.respond(/food (\d{0,}[\WA-Za-z]+\d{0,})/i, function(res) {
        sendFood(robot, res);
    })

}


// Send MSG

function sendFoods(robot, res) {
    updateJSON(robot, restaurantsJSONURL, function() {
        var result = ""
        restaurantsJSON.forEach(function(food, i) {
            result += (i + 1) + ". " + food.name + "\n";
        })
        res.send(result);
    })
}

function sendFood(robot, res) {
    updateJSON(robot, restaurantsJSONURL, function() {
        var mathcer = res.match[1];
        var result = "";
        if (mathcer.match(/\d+/) === null) {
            var matchedRestaurants = restaurantsJSON.filter(function(restaurant) {
                return restaurant.name.match(matcher) !== null;
            });
            if (matchedRestaurants.length > 1) {
                result = multipleRestaurants(matchedRestaurants);
            } else {
                result = displayRestaurant(matchedRestaurants[0])
            };
        } else {
            var restIndex = mathcer - 1;    
            var target = restaurantsJSON[restIndex]
        };
        
        
        var result = displayRestaurant(target);
        res.send(result);
    })
}
// Update Functions
function updateJSON(robot, url, callback) {
    robot.http(url)
        .get()(function(err, res, body) {
            restaurantsJSON = JSON.parse(body)
            callback();
        });
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

function multipleRestaurants(targets) {
    return "你可能在找... \n" + targets.map(function(target) {
        return "          " + target.name
    }).join("\n")
}