'use strict';
exports.__esModule = true;
//Load modules
var express_1 = require("express");
var Yaml = require("js-yaml");
var Fs = require("fs");
var http_proxy_1 = require("http-proxy");
var Crypto = require("crypto");
var nextRequestID = 1;
//Load config
var config = null;
try {
    var file = Fs.readFileSync('config.yml', 'utf-8');
    config = Yaml.load(file);
}
catch (error) {
    console.log('Could not load config: config.yml');
    process.exit(1);
}
console.log('Config loaded.');
// Log headers
function logHeaders(raw) {
    for (var i = 0; i < raw.length; i += 2) {
        console.log("".concat(raw[i], ": ").concat(raw[i + 1]));
    }
}
//Hash
function md5(data) {
    return Crypto.createHash('md5').update(data).digest('hex');
}
//Tampering
function tamperHeader(out, req) {
    var conf = (out) ? config.tampering.req.header :
        config.tampering.res.header;
    for (var h in conf) {
        req.setHeader(h, conf[h]);
        console.log(h, conf[h]);
    }
}
// Create proxy
var proxy = http_proxy_1["default"].createProxyServer({
    ws: true,
    changeOrigin: false,
    selfHandleResponse: true
});
proxy.on('proxyReq', function (preq, req, res) {
    //@ts-ignore
    req['id'] = nextRequestID++;
    tamperHeader(true, preq);
    //Log request
    //@ts-ignore
    console.log("--- (".concat(req.id, ") Request:"), req.method, req.url);
    //Log header
    logHeaders(req.rawHeaders);
    //Await body
    console.log('\n');
    var body = [];
    preq.on('data', function (chunk) {
        body.push(chunk);
    });
    preq.on('end', function () {
        var bodyStr = Buffer.concat(body).toString();
        console.log(bodyStr);
        console.log('---');
        res.end(bodyStr);
    });
});
//@ts-ignore
proxy.on('proxyRes', function (pres, req, res) {
    //Log header body
    //@ts-ignore
    console.log("--- (".concat(req.id, ") Response:"));
    tamperHeader(false, pres);
    //Log header
    //@ts-ignore
    logHeaders(pres.rawHeaders);
    //Await body
    console.log('\n');
    var body = [];
    pres.on('data', function (chunk) {
        body.push(chunk);
    });
    pres.on('end', function () {
        var bodyb = Buffer.concat(body);
        //Intercept
        //@ts-ignore
        if (config.intercept.contentType.includes(pres.headers['content-type'])) {
            var bodyStr = body.toString();
            console.log(bodyStr);
            console.log('---');
            res.end(bodyStr);
        }
        else //Do not intercept
         {
            console.log("md5hex:<".concat(md5(bodyb), ">"));
            console.log('---');
            res.end(body);
        }
    });
});
console.log('Proxy loaded.');
//Create express app
var app = (0, express_1["default"])();
app.get('*', function (req, res) {
    proxy.web(req, res, { target: "".concat(req.protocol, "://").concat(req.hostname) });
});
console.log('Server loaded.');
var server = app.listen(config.ports.http);
console.log('Server running.');
console.log('---------------');
