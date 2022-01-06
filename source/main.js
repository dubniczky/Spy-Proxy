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


// Log headers
function logHeaders(raw)
{
    for (let i = 0; i < raw.length; i += 2)
    {
        console.log(`${raw[i]}: ${raw[i+1]}`)
    }
}


// Create proxy
const proxy = HttpProxy.createProxyServer(
{
    ws: true,
    changeOrigin: false,
    selfHandleResponse: true
})

proxy.on('proxyReq', (preq, req, res) =>
{
    //Log request
    console.log('--- Request:', req.method, req.url)

    //Log header
    logHeaders(req.rawHeaders)

    //Await body
    console.log('\n')    
    let body = []

    preq.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    preq.on('end', () =>
    {
        body = Buffer.concat(body).toString();
        console.log(body)
        console.log('---')
        res.end(body)
    })
})
proxy.on('proxyRes', (pres, req, res) =>
{
    //Log header body
    console.log('--- Response')

    //Log header
    logHeaders(pres.rawHeaders)

    //Await body
    console.log('\n')
    var body = []

    pres.on('data', (chunk) =>
    {
        body.push(chunk)
    })

    pres.on('end', () =>
    {
        body = Buffer.concat(body).toString();
        console.log(body)
        console.log('---')
        res.end(body)
    })
})
console.log('Proxy loaded.')

//Create express app
const app = Express();

app.get('*', function(req, res)
{
    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` })
})

console.log('Server loaded.')


const server = app.listen(config.ports.http)
console.log('Server running.')
console.log('---------------')