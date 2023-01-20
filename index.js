var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

const paths =
{
    __root__: "http://localhost:3000",
    www: "http://localhost:3000",
    geopopulation: "http://localhost:8181",
}


app.use('*', function (req, res) {
    var host = req.headers.host;
    var subdomain = host.split('.')[0];
    var path = paths[subdomain];
    
    if (req.hostname != "localhost" && req.hostname != "127.0.0.1" && !req.hostname.includes("tomaemanuele.it")) {
        res.status(401).send("Unauthorized");
        return;
    }

    if (path)
        apiProxy.web(req, res, { target: path + req.originalUrl, ignorePath: true });
    
    if (!path)
        apiProxy.web(req, res, { target: paths.__root__ + req.originalUrl, ignorePath: true });

});

var server = require('http').createServer(app);

server.on('upgrade', function (req, socket, head) {
    var host = req.headers.host;
    var subdomain = host.split('.')[0];
    var path = paths[subdomain];

    if (path)
        apiProxy.ws(req, socket, head, { target: path + req.originalUrl, ws: true, ignorePath: true });

    if (!path)
        apiProxy.ws(req, socket, head, { target: paths.__root__ + req.originalUrl, ws: true, ignorePath: true });
});

server.on('listening', function () {
    console.log('Listening on port: %d', server.address().port);
});

server.on('error', function (err) {
    if (err.code !== 'ECONNREFUSED') {
        console.log(err);
    }
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

server.listen(80);