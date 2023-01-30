var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

const paths =
{
    www: "http://localhost:3000",
    geopopulation: "http://localhost:8181",
}

const redirects =
{
    __root__: "www",
}

app.use('*', function (req, res) {
    var host = req.headers.host;

    if (!host)
        return res.status(404).send("Not found");

    var subdomain = host.split('.').length > 2 ? host.split('.')[0] : "__root__";
    var path = paths[subdomain] || paths.__root__;

    if (redirects[subdomain])
    {
        const newSubdomain = redirects[subdomain];
        const cleanHostname = subdomain == "__root__" ? req.hostname : req.hostname.split('.').slice(1).join('.');
        res.redirect(301, req.protocol + '://' + newSubdomain + '.' + cleanHostname + req.originalUrl);
        return;
    }

    if (req.hostname != "localhost" && req.hostname != "127.0.0.1" && !req.hostname.includes("tomaemanuele.it")) {
        res.status(401).send("Unauthorized");
        return;
    }

    if (path)
        apiProxy.web(req, res, { target: path + req.originalUrl, ignorePath: true });
    
    if (!path)
    {
        if(paths.__root__)
            apiProxy.web(req, res, { target: paths.__root__ + req.originalUrl, ignorePath: true });
        if(!paths.__root__)
            res.status(404).send("Not found");
    }
        

});

var server = require('http').createServer(app);

server.on('upgrade', function (req, socket, head) {
    var host = req.headers.host;

    if (!host)
        return res.status(404).send("Not found");

    var subdomain = host.split('.').length > 2 ? host.split('.')[0] : "__root__";
    var path = paths[subdomain] || paths.__root__;

    if (redirects[subdomain])
    {
        const newSubdomain = redirects[subdomain];
        const cleanHostname = subdomain == "__root__" ? req.hostname : req.hostname.split('.').slice(1).join('.');
        res.redirect(301, req.protocol + '://' + newSubdomain + '.' + cleanHostname + req.originalUrl);
        return;
    }

    if (path)
        apiProxy.ws(req, socket, head, { target: path + req.originalUrl, ws: true, ignorePath: true });

    if (!path)
    {
        if (paths.__root__)
            apiProxy.ws(req, socket, head, { target: paths.__root__ + req.originalUrl, ws: true, ignorePath: true });
        if (!paths.__root__)
            res.status(404).send("Not found");
    }
        
});

server.on('listening', function () {
    console.log('Listening on port: %d', server.address().port);
});

process.on('uncaughtException', function (err) {
    if (err.code !== 'ECONNREFUSED') {
        console.log(err);
    }
});

server.listen(80);