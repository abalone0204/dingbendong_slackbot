var http = require('http');
function updateJSON(url, callback) {
    http.get(menusJSONURL, function (response) {
        var body="";
        response.on("data", function (chunk) {
            body+=chunk;
        })
        response.on("end", function () {
            var jsonData = JSON.parse(body);
            callback().call(this, jsonData)
        })
        
    })
}

module.exports.updateJSON = updateJSON;