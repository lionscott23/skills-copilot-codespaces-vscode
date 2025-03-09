// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var comments = [];
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    console.log("URL path: " + urlObj.pathname);
    console.log("URL search: " + urlObj.search);
    console.log("URL query: " + urlObj.query);
    if (urlObj.pathname.indexOf("comment") != -1) {
        console.log("comment route");
        if (req.method === "POST") {
            console.log("POST comment route");
            var fullBody = "";
            req.on('data', function (chunk) {
                fullBody += chunk.toString();
            });
            req.on('end', function () {
                console.log("fullBody: " + fullBody);
                var jsonObj = JSON.parse(fullBody);
                comments.push(jsonObj);
                console.log("comment: " + JSON.stringify(comments));
                res.writeHead(200);
                res.end("");
            });
        } else if (req.method === "GET") {
            console.log("GET comment route");
            res.writeHead(200);
            res.end(JSON.stringify(comments));
        }
    } else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
});
server.listen(8080);
console.log("Server is listening on port 8080");