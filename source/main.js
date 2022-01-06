'use strict'



//Load modules
const Express = require('express')
const Yaml = require('js-yaml')
const Fs = require('fs')
const HttpProxy = require('http-proxy')



//Load config
let config = null
try
{
    let file = Fs.readFileSync('config.yml', 'utf-8')
    config = Yaml.load(file)
}
catch (error)
{
    console.log('Could not load config: config.yml')
    process.exit(1)
}
console.log('Config loaded.')



// Create proxy
const proxy = HttpProxy.createProxyServer(
{
    ws: true,
    changeOrigin: false
})

proxy.on('proxyReq', (preq, req, res) =>
{
    console.log('--- Request Headers')
    console.log(req.rawHeaders)


    console.log('--- Request Body')
    console.log(req.body)})

proxy.on('proxyRes', (pres, req, res) =>
{
    console.log('--- Response Headers')
    console.log(pres.headers)

    console.log('--- Response Body')
    console.log(req.body)
    console.log(res.body)
    console.log(pres.body)
})
console.log('Proxy loaded.')

//Create express app
const app = Express();

app.get('*', function(req, res)
{
    console.log('Request:', req.method, req.url)
    console.log(req.headers)

    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` })
})

console.log('Server loaded.')




const server = app.listen(config.ports.http)
console.log('Server running.')
console.log('---------------')