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
    
    if (path)
        apiProxy.web(req, res, { target: path + req.originalUrl });
    
    if (!path)
        apiProxy.web(req, res, { target: paths.__root__ + req.originalUrl });

});

var server = require('http').createServer(app);

server.on('upgrade', function (req, socket, head) {
    var host = req.headers.host;
    var subdomain = host.split('.')[0];
    var path = paths[subdomain];

    if (path)
        apiProxy.ws(req, socket, head, { target: path });

    if (!path)
        apiProxy.ws(req, socket, head, { target: paths.__root__ });
});

server.on('listening', function () {
    console.log('Listening on port: %d', server.address().port);
});

server.listen(80);